import { Suspense } from "react";
import { DefaultLoader } from "./default-loader";
import type { createDialogStore } from "./store";

type Props<DialogProps extends Record<string, unknown>> = {
	store: ReturnType<typeof createDialogStore<DialogProps>>;
	render: (props: DialogProps) => React.ReactNode;
	loader?: React.ReactNode;
};

export function DialogManager<DialogProps extends Record<string, unknown>>({
	store: useStore,
	render,
	loader,
}: Props<DialogProps>) {
	const { isOpen, props } = useStore();

	const _loader = loader ?? <DefaultLoader />;

	return <Suspense fallback={_loader}>{isOpen && render(props)}</Suspense>;
}
