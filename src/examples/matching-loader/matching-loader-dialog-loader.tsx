import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function MatchingLoaderDialogLoader() {
	return (
		<Dialog open>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<Skeleton className="h-4 w-32" />
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-3">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
				</div>
			</DialogContent>
		</Dialog>
	);
}
