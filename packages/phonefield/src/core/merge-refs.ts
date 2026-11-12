import type React from "react";

/**
 * Compose refs. React 19 runs the returned cleanup on detach; React 18 ignores
 * it and calls the ref with `null`, which clears every ref the same way.
 */
export function mergeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): (value: T | null) => () => void {
	return (value) => {
		const cleanups = refs.map((ref) => {
			if (!ref) return undefined;
			if (typeof ref === "function") {
				const cleanup: unknown = ref(value);
				return typeof cleanup === "function"
					? (cleanup as () => void)
					: () => ref(null);
			}
			// React 18's types mark object refs read-only; React owns them the same way.
			const objectRef = ref as { current: T | null };
			objectRef.current = value;
			return () => {
				objectRef.current = null;
			};
		});
		return () => {
			for (const cleanup of cleanups) cleanup?.();
		};
	};
}
