import type React from "react";

/** Compose refs using React 19 callback-ref cleanups. */
export function mergeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	return (value) => {
		const cleanups = refs.map((ref) => {
			if (!ref) return undefined;
			if (typeof ref === "function") {
				const cleanup = ref(value);
				return typeof cleanup === "function" ? cleanup : () => ref(null);
			}
			ref.current = value;
			return () => {
				ref.current = null;
			};
		});
		return () => {
			for (const cleanup of cleanups) cleanup?.();
		};
	};
}
