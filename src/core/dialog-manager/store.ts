import { create } from "zustand";

type DialogState<
	Props extends Record<string, unknown> = Record<string, unknown>,
> = {
	isOpen: boolean;
	props: Props;
	open: (props: Props) => void;
	close: () => void;
};

export const createDialogStore = <Props extends Record<string, unknown>>() => {
	return create<DialogState<Props>>()((set) => ({
		isOpen: false,
		props: {} as Props,
		close: () => set({ isOpen: false }),
		open: (props: Props) => set({ isOpen: true, props }),
	}));
};
