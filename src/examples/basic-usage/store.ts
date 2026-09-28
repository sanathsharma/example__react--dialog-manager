import { createDialogStore } from "@/core/dialog-manager";

export type BasicUsageDialogProps = {
	name: string;
};

export const useBasicUsageDialog = createDialogStore<BasicUsageDialogProps>();
