import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { usePreloadedDialog } from "./store";

export default function PreloadedDialog() {
	const close = usePreloadedDialog((s) => s.close);

	return (
		<Dialog open onOpenChange={(open) => !open && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Preloaded on idle</DialogTitle>
					<DialogDescription>
						This chunk has an artificial 10sec minimum display time
					</DialogDescription>
				</DialogHeader>
				<p>
					`useIdlePreload` fetched it in the background once the page went
					idle, so its chunk was already cached before you clicked.
					React still briefly suspends the first time a lazy component
					renders, so a spinner can flash for a frame or two, but it opens
					far sooner than the {'"'}default loader{'"'} example, which only
					starts fetching on click.
				</p>
				<DialogFooter>
					<Button onClick={close}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
