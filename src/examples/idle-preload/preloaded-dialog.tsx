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
						This chunk has an artificial 1.5s minimum display time, same
						as the "default loader" example.
					</DialogDescription>
				</DialogHeader>
				<p>
					`useIdlePreload` fetched it in the background once the page went
					idle, so unless this tab is still busy loading, it opened without
					showing a spinner at all.
				</p>
				<DialogFooter>
					<Button onClick={close}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
