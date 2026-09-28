import { CircleNotchIcon } from "@phosphor-icons/react";
import { Dialog, DialogOverlay } from "@/components/ui/dialog";

export function DefaultLoader() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog open>
				<DialogOverlay />
			</Dialog>
			<CircleNotchIcon className="relative z-50 animate-spin" />
		</div>
	);
}
