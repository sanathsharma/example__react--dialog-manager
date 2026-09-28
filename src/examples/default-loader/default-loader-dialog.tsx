import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDefaultLoaderDialog } from "./store";

export default function DefaultLoaderDialog() {
	const close = useDefaultLoaderDialog((s) => s.close);

	return (
		<Dialog open onOpenChange={(open) => !open && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Default loader</DialogTitle>
					<DialogDescription>
						This dialog's component is loaded lazily, and no `loader` prop
						was passed to DialogManager.
					</DialogDescription>
				</DialogHeader>
				<p>
					While the chunk downloaded, DialogManager's built-in spinner
					covered the screen. Now that it's here, the real dialog takes
					over.
				</p>
				<DialogFooter>
					<Button onClick={close}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
