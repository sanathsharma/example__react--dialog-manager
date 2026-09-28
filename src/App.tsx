import { Button } from "@/components/ui/button";
import { DialogManager } from "@/core/dialog-manager";
import { lazy } from "@/lib/lazy";
import { useIdlePreload } from "@/lib/on-idle";

import { useBasicUsageDialog } from "@/examples/basic-usage/store";
import { BasicUsageDialog } from "@/examples/basic-usage/basic-usage-dialog";
import { useDefaultLoaderDialog } from "@/examples/default-loader/store";
import { useMatchingLoaderDialog } from "@/examples/matching-loader/store";
import { MatchingLoaderDialogLoader } from "@/examples/matching-loader/matching-loader-dialog-loader";
import { useLazyContentDialog } from "@/examples/nested-suspense/store";
import { LazyContentDialog } from "@/examples/nested-suspense/lazy-content-dialog";
import { useNoFlashDialog } from "@/examples/avoid-flash/store";
import { usePreloadedDialog } from "@/examples/idle-preload/store";

const DefaultLoaderDialog = lazy(
	() => import("@/examples/default-loader/default-loader-dialog"),
	1200,
);
const MatchingLoaderDialog = lazy(
	() => import("@/examples/matching-loader/matching-loader-dialog"),
	1200,
);
const NoFlashDialog = lazy(
	() => import("@/examples/avoid-flash/no-flash-dialog"),
	1000,
);
const PreloadedDialog = lazy(
	() => import("@/examples/idle-preload/preloaded-dialog"),
	1500,
);

type Example = {
	title: string;
	description: string;
	open: () => void;
	label: string;
};

function ExampleCard({ title, description, open, label }: Example) {
	return (
		<div className="flex flex-col gap-3 border border-border bg-card p-4">
			<div className="flex flex-col gap-1">
				<h2 className="font-heading text-sm font-medium">{title}</h2>
				<p className="text-xs/relaxed text-muted-foreground">
					{description}
				</p>
			</div>
			<Button className="self-start" onClick={open}>
				{label}
			</Button>
		</div>
	);
}

function App() {
	const openBasicUsage = useBasicUsageDialog((s) => s.open);
	const openDefaultLoader = useDefaultLoaderDialog((s) => s.open);
	const openMatchingLoader = useMatchingLoaderDialog((s) => s.open);
	const openLazyContent = useLazyContentDialog((s) => s.open);
	const openNoFlash = useNoFlashDialog((s) => s.open);
	const openPreloaded = usePreloadedDialog((s) => s.open);

	useIdlePreload([PreloadedDialog.preload]);

	const examples: Example[] = [
		{
			title: "Basic usage",
			description:
				"A dialog registered directly with DialogManager, no lazy loading.",
			open: () => openBasicUsage({ name: "there" }),
			label: "Open dialog",
		},
		{
			title: "Default loader",
			description:
				"Lazy-loaded with no custom `loader`, so DialogManager falls back to its built-in spinner.",
			open: () => openDefaultLoader({}),
			label: "Open dialog",
		},
		{
			title: "Loader matching the dialog",
			description:
				"Lazy-loaded with a `loader` built from the same header and title as the real dialog.",
			open: () => openMatchingLoader({}),
			label: "Open dialog",
		},
		{
			title: "Lazy content, loaded shell",
			description:
				"The dialog shell is registered directly; only a piece inside it is lazy, behind its own Suspense.",
			open: () => openLazyContent({}),
			label: "Open dialog",
		},
		{
			title: "Avoiding loader flash",
			description:
				"Lazy-loaded with a minimum display time, so a fast chunk doesn't make the loader blink.",
			open: () => openNoFlash({}),
			label: "Open dialog",
		},
		{
			title: "Preloading on idle",
			description:
				"Lazy-loaded and preloaded once the browser goes idle, so it's usually already cached by the time it opens.",
			open: () => openPreloaded({}),
			label: "Open dialog",
		},
	];

	return (
		<div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-heading text-lg font-medium">
					Dialog manager examples
				</h1>
				<p className="text-xs/relaxed text-muted-foreground">
					Each card below opens a dialog built with a different pattern
					from the README.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{examples.map((example) => (
					<ExampleCard key={example.title} {...example} />
				))}
			</div>

			<DialogManager
				store={useBasicUsageDialog}
				render={(props) => <BasicUsageDialog {...props} />}
			/>
			<DialogManager
				store={useDefaultLoaderDialog}
				render={() => <DefaultLoaderDialog />}
			/>
			<DialogManager
				store={useMatchingLoaderDialog}
				render={() => <MatchingLoaderDialog />}
				loader={<MatchingLoaderDialogLoader />}
			/>
			<DialogManager
				store={useLazyContentDialog}
				render={() => <LazyContentDialog />}
			/>
			<DialogManager
				store={useNoFlashDialog}
				render={() => <NoFlashDialog />}
			/>
			<DialogManager
				store={usePreloadedDialog}
				render={() => <PreloadedDialog />}
			/>
		</div>
	);
}

export default App;
