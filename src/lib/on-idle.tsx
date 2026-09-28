import { useEffect, useRef } from "react";

/**
 * Runs a callback once the page has finished loading and the browser is idle.
 *
 * Waits for the window `load` event (or runs right away if the page has already
 * loaded), then schedules the callback with `requestIdleCallback`. In browsers
 * without `requestIdleCallback` (Safari), it falls back to a short `setTimeout`.
 *
 * The latest callback is always used, so an inline function doesn't cause the
 * effect to re-run. Any pending callback is cancelled on unmount or when
 * `enabled` becomes `false`.
 *
 * @param callback - Function to run when the browser is idle.
 * @param enabled - When `false`, nothing is scheduled. Flipping it to `true`
 *   schedules the callback; flipping it back to `false` cancels a pending one.
 *   Defaults to `true`.
 * @param timeout - Maximum time in ms to wait for idle time before running
 *   the callback anyway. Defaults to `2000`.
 *
 * @example
 * // Warm up a cache once the page is idle
 * useOnIdle(() => {
 *   queryClient.prefetchQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });
 * });
 *
 * @example
 * // Only run once a condition is met
 * useOnIdle(() => initAnalytics(), hasConsent);
 */
export function useOnIdle(
	callback: () => void,
	enabled = true,
	timeout = 2000,
) {
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		if (!enabled) return;

		let idleId: number | undefined;
		let timerId: ReturnType<typeof setTimeout> | undefined;

		const run = () => callbackRef.current();

		const scheduleIdle = () => {
			if ("requestIdleCallback" in window) {
				idleId = requestIdleCallback(run, { timeout });
			} else {
				timerId = setTimeout(run, 200); // Safari fallback
			}
		};

		if (document.readyState === "complete") scheduleIdle();
		else window.addEventListener("load", scheduleIdle, { once: true });

		return () => {
			window.removeEventListener("load", scheduleIdle);
			if (idleId !== undefined) cancelIdleCallback(idleId);
			if (timerId !== undefined) clearTimeout(timerId);
		};
	}, [enabled, timeout]);
}

type Loader = () => Promise<unknown>;

/**
 * Preloads lazy-loaded chunks in parallel once the page has loaded and the
 * browser is idle.
 *
 * Built on {@link useOnIdle}. All loaders run together with `Promise.all`.
 * A failed loader is swallowed so it doesn't reject the others or cause an
 * unhandled rejection; the error will surface again if the component is
 * actually rendered.
 *
 * Designed for loaders with cached promises (such as the `preload` method
 * from the custom `lazy` helper), so calling them more than once is safe.
 *
 * @param loaders - Functions that start loading a chunk, e.g. `Component.preload`.
 * @param enabled - When `false`, nothing is preloaded. Use it to preload only
 *   the chunks a user can actually reach (e.g. based on role or permissions).
 *   Defaults to `true`.
 *
 * @example
 * const Settings = lazy(() => import("./Settings"));
 *
 * function App() {
 *   useIdlePreload([Settings.preload]);
 *   return <Routes />;
 * }
 *
 * @example
 * // RBAC: preload admin-only chunks once permissions are known
 * const AdminPanel = lazy(() => import("./AdminPanel"));
 * const Reports = lazy(() => import("./Reports"));
 *
 * function App() {
 *   const { user } = useAuth();
 *   useIdlePreload([AdminPanel.preload, Reports.preload], user?.role === "admin");
 *   return <Routes />;
 * }
 */
export function useIdlePreload(loaders: Loader[], enabled = true) {
	useOnIdle(() => {
		Promise.all(loaders.map((load) => load().catch(() => {})));
	}, enabled);
}
