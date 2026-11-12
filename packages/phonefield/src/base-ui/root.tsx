"use client";

import { useRender } from "@base-ui/react/use-render";
import type React from "react";
import { withRef } from "../core/compat.js";
import { splitRootProps, usePhoneFieldRoot } from "../core/root.js";
import type { PhoneField } from "./component.js";

/**
 * Owns the phone value, field state, history, and form serialization.
 * Renders a `<div>` by default; use `render` to compose your own field shell.
 */
export const Root = withRef(function Root(props: PhoneField.RootProps) {
	const { options, elementProps } = splitRootProps(props);
	const { render, className, style, children, ref, ...rest } = elementProps;
	const { state, mergedRootRef, hiddenInput, focusHandlers, provide } =
		usePhoneFieldRoot(options, ref);

	const ownProps: React.ComponentProps<"div"> = {
		className: typeof className === "function" ? className(state) : className,
		style: typeof style === "function" ? style(state) : style,
		children: (
			<>
				{children}
				{hiddenInput}
			</>
		),
	};

	const element = useRender({
		defaultTagName: "div",
		render,
		ref: mergedRootRef,
		state,
		props: {
			"data-slot": "phone-field",
			...rest,
			...ownProps,
			...focusHandlers,
		},
	});

	return provide(element);
});
