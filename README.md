# Dialog manager

A store-backed dialog/modal system built on Zustand, with built-in Suspense support for lazy-loaded dialogs.

## Basic usage

```tsx
// EditProfileModal.tsx

type EditProfileProps = {
  firstName: string;
  lastName: string;
  onChange: (firstName: string, lastName: string) => void;
};

export const useEditProfile = createDialogStore<EditProfileProps>();
export const { useIsOpen, useOpen, useClose, useProps } = useEditProfile;

export const EditProfileModal = (props: EditProfileProps) => {
  const { firstName, lastName } = props;
  const close = useEditProfile((s) => s.close);

  return (
    // implement the dialog
  );
};
```

`createDialogStore` returns a plain Zustand store. Register the resulting store with a `DialogManager`, placed at the root of the page, a parent component, or a layout:

```tsx
import { EditProfileModal, useEditProfile } from "./EditProfileModal";

<DialogManager store={useEditProfile} render={(props) => <EditProfileModal {...props} />} />
```

Any nested component can then open the dialog:

```tsx
// inside any component
const openEditProfileModal = useEditProfile((s) => s.open);

// inside a click handler
openEditProfileModal({
  firstName: "John",
  lastName: "Doe",
  onChange: (firstName, lastName) => {
    console.log(firstName, lastName);
  },
});
```

## Stale closures in callbacks and data

The store holds the callbacks and data passed to `open()`. If a callback closes over state or props from the component that opened the dialog, it keeps the values from the moment `open()` was called, not later updates. The same applies to any other data passed to `open()`.

## Accessing props without drilling

Data passed to `open()` goes to the `DialogManager`'s render function and the modal component as props, and is also available through `state.props` or the `useProps` hook. Nested components, form fields for example, can read it without prop drilling:

```tsx
const props = useProps();
// or
const props = useEditProfile((s) => s.props);
// or
const firstName = useEditProfile((s) => s.props.firstName);
```

## Lazy loading

`DialogManager` wraps its render function in a `Suspense` boundary with a default loader, so a dialog component can be imported lazily:

```tsx
const EditProfileModal = lazy(() => import("./EditProfileModal"));
```

This lets a dialog, modal, drawer, or similar component carry a lot of logic, and lets a page have several of them, without adding that code to the page's initial JS bundle. The dialog's code downloads only when its trigger is clicked, so the page loads faster, including for users whose triggers are disabled by role.

### A loader that matches the dialog

`DialogManager`'s `loader` prop replaces the default spinner. Building it from the same `Dialog` components as the real modal keeps the header, title, and close button in place while only the body waits on the chunk to download:

```tsx
// EditProfileModalLoader.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function EditProfileModalLoader() {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="h-4 w-32" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

`DialogContent` renders its own close button by default, so the loader gets one without extra work.

```tsx
import { lazy } from "@/lib/lazy";
import { EditProfileModalLoader } from "./EditProfileModalLoader";

const EditProfileModal = lazy(() => import("./EditProfileModal"));

<DialogManager
  store={useEditProfile}
  render={(props) => <EditProfileModal {...props} />}
  loader={<EditProfileModalLoader />}
/>
```

### Lazy content inside an already-loaded shell

The `render` function can carry its own `Suspense` and its own skeleton, instead of relying on `DialogManager`'s. Register `EditProfileModal` directly, not through `lazy()`, and `DialogManager`'s `Suspense` never suspends for it, so its `loader` prop never shows. The shell, `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, sits outside any `Suspense` and renders the moment the dialog opens. Only the expensive part, a form that pulls in a large library, for example, is lazy-loaded and wrapped in its own `Suspense` with a skeleton fallback:

```tsx
// EditProfileModal.tsx
import { Suspense, lazy } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const EditProfileForm = lazy(() => import("./EditProfileForm"));

function EditProfileFormSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function EditProfileModal(props: EditProfileProps) {
  const close = useEditProfile((s) => s.close);

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<EditProfileFormSkeleton />}>
          <EditProfileForm {...props} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
```

```tsx
import { EditProfileModal, useEditProfile } from "./EditProfileModal";

<DialogManager store={useEditProfile} render={(props) => <EditProfileModal {...props} />} />
```

`EditProfileModal` is imported directly here, not lazily, so `DialogManager` never suspends and its `loader` prop is unnecessary. The title and close button render as soon as the dialog opens, and only `EditProfileForm` waits behind its own skeleton.

### Avoiding loader flash

On a fast connection, or for a light dialog, the default loader can flash on screen and disappear almost immediately, which reads as a glitch. `@/lib/lazy` wraps `lazy()` with an optional minimum display time, in milliseconds, that keeps the loader visible before it's removed:

```tsx
import { lazy } from "@/lib/lazy";

const EditProfileModal = lazy(() => import("./EditProfileModal"), 1000);
```

### Preloading on idle

The wrapped `lazy()` also exposes a `preload` method. `@/lib/on-idle` exposes a `useIdlePreload` hook that calls `preload` once the browser goes idle after the initial page load, so a frequently used dialog never has to show its loader. The hook takes an `enabled` argument to skip preloading when a dialog won't be opened, for example when RBAC hides it from the current user.

```tsx
import { lazy } from "@/lib/lazy";

const AdminPanel = lazy(() => import("./AdminPanel"));
const Reports = lazy(() => import("./Reports"));

function App() {
  const { user } = useAuth();
  useIdlePreload([AdminPanel.preload, Reports.preload], user?.role === "admin");
  return <Routes />;
}
```
