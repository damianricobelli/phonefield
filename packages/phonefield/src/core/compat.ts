import React from "react";

/** React 19 passes `ref` to function components as a regular prop. */
const REF_IS_A_PROP = Number.parseInt(React.version, 10) >= 19;

/**
 * Declares a part that reads `ref` from its props on React 18 and 19.
 *
 * React 19 already passes `ref` as a prop, so the part is returned as is.
 * React 18 strips `ref` from function-component props; there the part is
 * wrapped in `forwardRef`, which hands the ref back as a prop. The part's
 * public type is the same on both versions.
 */
export function withRef<P extends object>(
	render: (props: P) => React.ReactNode,
): (props: P) => React.ReactNode {
	if (REF_IS_A_PROP) return render;
	// biome-ignore lint/correctness/noComponentHookFactories: called once per part at module level, never during render.
	const Component = React.forwardRef<unknown, P>((props, ref) =>
		render(ref ? ({ ...props, ref } as P) : (props as P)),
	);
	Component.displayName = render.name;
	return Component as unknown as (props: P) => React.ReactNode;
}

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server. React 18 warns
 * when `useLayoutEffect` runs during server rendering.
 */
export const useIsomorphicLayoutEffect =
	typeof document !== "undefined" ? React.useLayoutEffect : React.useEffect;
