import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useLazyContentDialog } from "./store";

const LazyContentBody = lazy(() => import("./lazy-content-body"));

function LazyContentBodySkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<Skeleton className="h-3 w-full" />
			<Skeleton className="h-3 w-2/3" />
		</div>
	);
}

export function LazyContentDialog() {
	const close = useLazyContentDialog((s) => s.close);

	return (
		<Dialog open onOpenChange={(open) => !open && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Lazy content, loaded shell</DialogTitle>
					<DialogDescription>
						`LazyContentDialog` is registered directly with
						`DialogManager`, so this shell renders the instant the dialog
						opens.
					</DialogDescription>
				</DialogHeader>
				<Suspense fallback={<LazyContentBodySkeleton />}>
					<LazyContentBody />
				</Suspense>
				<DialogFooter>
					<Button onClick={close}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
