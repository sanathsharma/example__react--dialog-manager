import { lazy as reactLazy } from "react";
import { wait } from "./promise";

export function lazy<T extends React.ComponentType<any>>(
	factory: () => Promise<{ default: T }>,
	delayMs = 0,
) {
	let promise: Promise<{ default: T }> | undefined;
	let loaded = false;

	const preload = () => {
		promise ??= factory().then((mod) => {
			loaded = true;
			return mod;
		});
		return promise;
	};

	const load = async () => {
		const p = preload();
		if (!delayMs || loaded) return p;
		const [mod] = await Promise.all([p, wait(delayMs)]);
		return mod;
	};

	return Object.assign(reactLazy(load), { preload });
}
