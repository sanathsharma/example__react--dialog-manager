import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useBasicUsageDialog, type BasicUsageDialogProps } from "./store";

export function BasicUsageDialog({ name }: BasicUsageDialogProps) {
	const close = useBasicUsageDialog((s) => s.close);

	return (
		<Dialog open onOpenChange={(open) => !open && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Basic usage</DialogTitle>
					<DialogDescription>
						Registered directly, no code-splitting involved.
					</DialogDescription>
				</DialogHeader>
				<p>
					Hi {name}, this dialog's component is imported normally, so it
					opened the instant the button was clicked.
				</p>
				<DialogFooter>
					<Button onClick={close}>Got it</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
