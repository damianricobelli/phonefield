import { Input as BaseInput } from "@base-ui/react/input";
import React from "react";
import type { PhoneField } from "./component.js";
import { usePhoneFieldInputContext } from "./context.js";
import { mergeRefs } from "./merge-refs.js";

function removeCharAt(value: string, index: number) {
	return value.slice(0, index) + value.slice(index + 1);
}

function findPrevDigitIndex(value: string, from: number) {
	let index = from;
	while (index > 0 && /\D/.test(value[index - 1] ?? "")) index--;
	return index - 1;
}

/** Number input bound to the selected country. */
export const Input = React.forwardRef<HTMLInputElement, PhoneField.InputProps>(
	function Input(
		{
			className,
			type = "tel",
			inputMode = "tel",
			autoComplete = "tel-national",
			onKeyDown,
			...props
		},
		forwardedRef,
	) {
		const { value, setNumber } = usePhoneFieldInputContext();
		const inputRef = React.useRef<HTMLInputElement>(null);
		const mergedRef = React.useMemo(
			() => mergeRefs(React.version, forwardedRef, inputRef),
			[forwardedRef],
		);

		return (
			<BaseInput
				{...props}
				ref={mergedRef}
				type={type}
				inputMode={inputMode}
				autoComplete={autoComplete}
				className={className}
				value={value.nationalNumber}
				onKeyDown={(event) => {
					onKeyDown?.(event);
					if (event.defaultPrevented || event.key !== "Backspace") return;

					const element = inputRef.current;
					if (!element) return;

					const start = element.selectionStart ?? 0;
					const end = element.selectionEnd ?? 0;
					const previousCharacter = element.value[start - 1];
					if (start !== end || start === 0 || !previousCharacter) return;
					if (!/\D/.test(previousCharacter)) return;

					event.preventDefault();
					const digitIndex = findPrevDigitIndex(element.value, start);
					if (digitIndex < 0) return;

					setNumber(removeCharAt(element.value, digitIndex));
					requestAnimationFrame(() => {
						element.setSelectionRange(digitIndex, digitIndex);
					});
				}}
				onValueChange={setNumber}
			/>
		);
	},
);
