"use client";

import { useRender } from "@base-ui/react/use-render";
import type React from "react";
import { splitRootProps, usePhoneFieldRoot } from "../core/root.js";
import type { PhoneField } from "./component.js";

/**
 * Owns the phone value, field state, history, and form serialization.
 * Renders a `<div>` by default; use `render` to compose your own field shell.
 */
export function Root(props: PhoneField.RootProps) {
	const { options, elementProps } = splitRootProps(props);
	const { render, className, style, children, ...rest } = elementProps;
	const { state, rootRef, hiddenInput, focusHandlers, provide } =
		usePhoneFieldRoot(options);

	const ownProps: React.ComponentProps<"div"> & { "data-slot": string } = {
		className: typeof className === "function" ? className(state) : className,
		style: typeof style === "function" ? style(state) : style,
		"data-slot": "phone-field",
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
		ref: rootRef,
		state,
		props: { ...rest, ...ownProps, ...focusHandlers },
	});

	return provide(element);
}
