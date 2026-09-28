import { Suspense } from "react";
import { DefaultLoader } from "./default-loader";
import type { createDialogStore } from "./store";

type Props = {
	store: ReturnType<typeof createDialogStore>;
	render: (props: Record<string, unknown>) => React.ReactNode;
	loader?: React.ReactNode;
};

export function DialogManager({ store: useStore, render, loader }: Props) {
	const { isOpen, props } = useStore();

	const _loader = loader ?? <DefaultLoader />;

	return <Suspense fallback={_loader}>{isOpen && render(props)}</Suspense>;
}
