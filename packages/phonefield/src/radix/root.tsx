"use client";

import { Slot } from "radix-ui";
import { withRef } from "../core/compat.js";
import { getStateDataAttributes } from "../core/field.js";
import { splitRootProps, usePhoneFieldRoot } from "../core/root.js";
import type { PhoneField } from "./component.js";

/**
 * Owns the phone value, field state, history, and form serialization.
 * Renders a `<div>` by default; use `asChild` to compose your own field shell.
 */
export const Root = withRef(function Root(props: PhoneField.RootProps) {
	const { options, elementProps } = splitRootProps(props);
	const { asChild, children, ref, ...rest } = elementProps;
	const { state, mergedRootRef, hiddenInput, focusHandlers, provide } =
		usePhoneFieldRoot(options, ref);
	const ownProps = {
		"data-slot": "phone-field",
		...rest,
		...getStateDataAttributes(state),
		...focusHandlers,
		ref: mergedRootRef,
	};

	return provide(
		asChild ? (
			<Slot.Root {...ownProps}>
				<Slot.Slottable>{children}</Slot.Slottable>
				{hiddenInput}
			</Slot.Root>
		) : (
			<div {...ownProps}>
				{children}
				{hiddenInput}
			</div>
		),
	);
});
