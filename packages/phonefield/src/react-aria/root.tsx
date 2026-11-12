"use client";

import type React from "react";
import { useRenderProps } from "react-aria-components/useRenderProps";
import { withRef } from "../core/compat.js";
import { type DataAttributes, getStateDataAttributes } from "../core/field.js";
import { splitRootProps, usePhoneFieldRoot } from "../core/root.js";
import type { PhoneField } from "./component.js";

/**
 * Owns the phone value, field state, history, and form serialization.
 * Renders a `<div>`; `className`, `style`, `children`, and `render` accept
 * functions of the field state, like any React Aria component.
 */
export const Root = withRef(function Root(props: PhoneField.RootProps) {
	const { options, elementProps } = splitRootProps(props);
	const { className, style, children, render, ref, ...rest } = elementProps;
	const { state, mergedRootRef, hiddenInput, focusHandlers, provide } =
		usePhoneFieldRoot(options, ref);
	const renderProps = useRenderProps<PhoneField.State, "div">({
		className:
			typeof className === "function"
				? (values) => className(values) ?? ""
				: className,
		style,
		children,
		render,
		values: state,
	});
	const domProps: React.ComponentProps<"div"> & DataAttributes = {
		"data-slot": "phone-field",
		...rest,
		...getStateDataAttributes(state),
		...focusHandlers,
		ref: mergedRootRef,
		className: renderProps.className,
		style: renderProps.style,
		children: (
			<>
				{renderProps.children}
				{hiddenInput}
			</>
		),
	};

	return provide(
		renderProps.render ? (
			renderProps.render(domProps, state)
		) : (
			<div {...domProps} />
		),
	);
});
