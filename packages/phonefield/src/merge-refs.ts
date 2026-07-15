import type React from "react";

/**
 * Compose refs while adapting teardown to the installed React contract.
 * React 19 consumes the returned cleanup; React 18 calls the merged ref with null.
 */
export function mergeRefs<T>(
	reactVersion: string,
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
	const supportsCleanupReturn = Number.parseInt(reactVersion, 10) >= 19;
	let cleanups: Array<() => void> = [];

	function cleanup() {
		const pendingCleanups = cleanups;
		cleanups = [];
		for (const cleanupRef of pendingCleanups) {
			cleanupRef();
		}
	}

	return (value) => {
		if (value === null) {
			cleanup();
			return;
		}

		cleanup();
		for (const ref of refs) {
			if (!ref) continue;

			if (typeof ref === "function") {
				const cleanupRef = ref(value);
				cleanups.push(
					typeof cleanupRef === "function" ? cleanupRef : () => ref(null),
				);
			} else {
				(ref as React.RefObject<T | null>).current = value;
				cleanups.push(() => {
					(ref as React.RefObject<T | null>).current = null;
				});
			}
		}

		if (supportsCleanupReturn) {
			return cleanup;
		}
	};
}
