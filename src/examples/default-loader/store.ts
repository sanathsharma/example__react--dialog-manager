import { createDialogStore } from "@/core/dialog-manager";

export const useDefaultLoaderDialog = createDialogStore<Record<string, never>>();
