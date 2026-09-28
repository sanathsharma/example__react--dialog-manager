import { createDialogStore } from "@/core/dialog-manager";

export const usePreloadedDialog = createDialogStore<Record<string, never>>();
