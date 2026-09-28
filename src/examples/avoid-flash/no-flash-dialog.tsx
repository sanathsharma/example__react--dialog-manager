import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useNoFlashDialog } from "./store";

export default function NoFlashDialog() {
	const close = useNoFlashDialog((s) => s.close);

	return (
		<Dialog open onOpenChange={(open) => !open && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>No loader flash</DialogTitle>
					<DialogDescription>
						This chunk is tiny and loads almost instantly.
					</DialogDescription>
				</DialogHeader>
				<p>
					Without a minimum display time, the default loader would have
					blinked on screen for a frame and vanished. `lazy()` was given a
					1000ms minimum here, so the loader held instead of flashing.
				</p>
				<DialogFooter>
					<Button onClick={close}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
