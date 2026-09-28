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
	const useStore = create<DialogState<Props>>()((set) => ({
		isOpen: false,
		props: {} as Props,
		close: () => set({ isOpen: false, props: {} as Props }),
		open: (props: Props) => set({ isOpen: true, props }),
	}));

	return Object.assign(useStore, {
		useIsOpen: () => useStore((s) => s.isOpen),
		useOpen: () => useStore((s) => s.open),
		useClose: () => useStore((s) => s.close),
		useProps: () => useStore((s) => s.props),
		useStore,
	});
};
