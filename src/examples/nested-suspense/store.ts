import { createDialogStore } from "@/core/dialog-manager";

export const useLazyContentDialog = createDialogStore<Record<string, never>>();
