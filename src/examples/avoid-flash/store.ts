import { createDialogStore } from "@/core/dialog-manager";

export const useNoFlashDialog = createDialogStore<Record<string, never>>();
