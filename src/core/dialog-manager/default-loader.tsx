import { CircleNotchIcon } from "@phosphor-icons/react";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";

export function DefaultLoader() {
	return (
		<div className="fixed flex h-screen w-screen items-center justify-center">
			<Dialog>
				<DialogOverlay />
			</Dialog>
			<CircleNotchIcon className="animate-spin" />
		</div>
	);
}
