import { Component, type ErrorInfo, type ReactNode } from "react";

export interface FallbackProps {
	error: Error;
	reset: () => void;
}

export interface ErrorBoundaryProps {
	children?: ReactNode;
	/** Static element, or a render function that receives the error and a reset callback. */
	fallback?: ReactNode | ((props: FallbackProps) => ReactNode);
	/** Called once per caught error, e.g. to send it to a logging service. */
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	/** Called right before the boundary clears its error state. */
	onReset?: () => void;
	/** When any value in this array changes, the boundary resets automatically. */
	resetKeys?: ReadonlyArray<unknown>;
}

interface ErrorBoundaryState {
	error: Error | null;
}

/**
 * Catches errors thrown while rendering its children and shows a fallback
 * instead of unmounting the whole app.
 *
 * Does NOT catch errors in event handlers, async code (setTimeout, promises),
 * server-side rendering, or the boundary itself.
 *
 * @example
 * // Default fallback
 * import ErrorBoundary from "@/core/error-boundary";
 *
 * <ErrorBoundary>
 *   <Dashboard />
 * </ErrorBoundary>
 *
 * @example
 * // Custom fallback with a retry button, logging, and auto-reset on route change
 * import ErrorBoundary from "./ErrorBoundary";
 *
 * <ErrorBoundary
 *   fallback={({ error, reset }) => (
 *     <div>
 *       <p>Couldn't load profile: {error.message}</p>
 *       <button onClick={reset}>Retry</button>
 *     </div>
 *   )}
 *   onError={(error, info) => logToService(error, info.componentStack)}
 *   resetKeys={[location.pathname]}
 * >
 *   <Profile />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(thrown: unknown): ErrorBoundaryState {
		return { error: toError(thrown) };
	}

	componentDidCatch(thrown: unknown, errorInfo: ErrorInfo): void {
		const error = toError(thrown);
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		} else {
			console.error("ErrorBoundary caught an error:", error, errorInfo);
		}
	}

	componentDidUpdate(prevProps: ErrorBoundaryProps): void {
		if (
			this.state.error &&
			haveKeysChanged(prevProps.resetKeys, this.props.resetKeys)
		) {
			this.reset();
		}
	}

	reset = (): void => {
		this.props.onReset?.();
		this.setState({ error: null });
	};

	render(): ReactNode {
		const { error } = this.state;
		const { fallback, children } = this.props;

		if (!error) return children;

		if (typeof fallback === "function") {
			return fallback({ error, reset: this.reset });
		}
		if (fallback !== undefined) return fallback;

		return <DefaultFallback error={error} reset={this.reset} />;
	}
}

/** JavaScript can throw anything (strings, objects, undefined), so normalize to Error. */
function toError(thrown: unknown): Error {
	if (thrown instanceof Error) return thrown;
	if (typeof thrown === "string") return new Error(thrown);
	try {
		return new Error(JSON.stringify(thrown));
	} catch {
		return new Error(String(thrown));
	}
}

function haveKeysChanged(
	prev: ReadonlyArray<unknown> = [],
	next: ReadonlyArray<unknown> = [],
): boolean {
	return (
		prev.length !== next.length ||
		prev.some((key, i) => !Object.is(key, next[i]))
	);
}

function DefaultFallback({ error, reset }: FallbackProps) {
	return (
		<div
			role="alert"
			style={{ padding: 16, border: "1px solid #d33", borderRadius: 6 }}
		>
			<p style={{ margin: "0 0 8px", fontWeight: 600 }}>
				This section failed to load.
			</p>
			<pre
				style={{ margin: "0 0 12px", whiteSpace: "pre-wrap", color: "#a11" }}
			>
				{error.message}
			</pre>
			<button type="button" onClick={reset}>
				Try again
			</button>
		</div>
	);
}
