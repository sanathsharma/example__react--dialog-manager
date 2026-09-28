import { createDialogStore } from "@/core/dialog-manager";

export const useMatchingLoaderDialog = createDialogStore<Record<string, never>>();
