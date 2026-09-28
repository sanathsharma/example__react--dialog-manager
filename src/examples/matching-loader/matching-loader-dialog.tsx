import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useMatchingLoaderDialog } from "./store";

export default function MatchingLoaderDialog() {
	const close = useMatchingLoaderDialog((s) => s.close);

	return (
		<Dialog open onOpenChange={(open) => !open && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Matching loader</DialogTitle>
					<DialogDescription>
						This is the real dialog, built from the same header and
						title as its loader.
					</DialogDescription>
				</DialogHeader>
				<p>
					The loader below reused these `Dialog`, `DialogHeader`, and
					`DialogTitle` components, so the frame never moved once the
					chunk finished downloading.
				</p>
				<DialogFooter>
					<Button onClick={close}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
