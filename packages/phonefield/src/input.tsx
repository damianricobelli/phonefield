import { Input as BaseInput } from "@base-ui/react/input";
import React from "react";
import type { PhoneField } from "./component.js";
import { usePhoneFieldInputContext } from "./context.js";
import type {
	PhoneFieldEditKind,
	PhoneFieldHistorySnapshot,
	PhoneFieldInputSelection,
} from "./history.js";
import { mergeRefs } from "./merge-refs.js";

function removeCharAt(value: string, index: number) {
	return value.slice(0, index) + value.slice(index + 1);
}

function findPrevDigitIndex(value: string, from: number) {
	let index = from;
	while (index > 0 && /\D/.test(value[index - 1] ?? "")) index--;
	return index - 1;
}

function getEditKind(
	inputType: string,
	selection: PhoneFieldInputSelection,
): PhoneFieldEditKind {
	switch (inputType) {
		case "insertText":
		case "insertCompositionText":
			return selection.start === selection.end ? "insert" : "replace";
		case "deleteContentBackward":
		case "deleteWordBackward":
			return "delete-backward";
		case "deleteContentForward":
		case "deleteWordForward":
			return "delete-forward";
		case "insertFromPaste":
		case "insertFromPasteAsQuotation":
			return "paste";
		case "deleteByCut":
			return "cut";
		case "insertFromDrop":
			return "drop";
		default:
			return "replace";
	}
}

function getKeyboardInputType(event: React.KeyboardEvent<HTMLInputElement>) {
	if (event.key === "Backspace") return "deleteContentBackward";
	if (event.key === "Delete") return "deleteContentForward";
	if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
		return "insertText";
	}
	return undefined;
}

/** Number input bound to the selected country. */
export const Input = React.forwardRef<HTMLInputElement, PhoneField.InputProps>(
	function Input(
		{
			className,
			type = "tel",
			inputMode = "tel",
			autoComplete = "tel-national",
			onBlur,
			onBeforeInput,
			onInputCapture,
			onKeyDown,
			onPointerDown,
			onSelect,
			...props
		},
		forwardedRef,
	) {
		const {
			value,
			setNumber,
			rememberSelection,
			breakHistoryGroup,
			undo,
			redo,
		} = usePhoneFieldInputContext();
		const inputRef = React.useRef<HTMLInputElement>(null);
		const pendingEditRef = React.useRef<{
			kind: PhoneFieldEditKind;
			selection: PhoneFieldInputSelection;
		}>({ kind: "unknown", selection: { start: 0, end: 0 } });
		const pendingRestoreRef = React.useRef<PhoneFieldHistorySnapshot | null>(
			null,
		);
		const mergedRef = React.useMemo(
			() => mergeRefs(React.version, forwardedRef, inputRef),
			[forwardedRef],
		);
		const readSelection = React.useCallback(() => {
			const element = inputRef.current;
			return {
				start: element?.selectionStart ?? 0,
				end: element?.selectionEnd ?? 0,
			};
		}, []);
		React.useLayoutEffect(() => {
			const pendingRestore = pendingRestoreRef.current;
			const element = inputRef.current;
			if (!pendingRestore || !element) return;

			pendingRestoreRef.current = null;
			if (
				pendingRestore.value.countryIso2 !== value.countryIso2 ||
				pendingRestore.value.nationalNumber !== value.nationalNumber
			) {
				return;
			}
			const { selection } = pendingRestore;
			const max = element.value.length;
			const start = Math.min(selection.start, max);
			const end = Math.min(selection.end, max);
			element.setSelectionRange(start, end);
			rememberSelection({ start, end });
		});

		return (
			<BaseInput
				{...props}
				ref={mergedRef}
				data-slot="phone-field-input"
				type={type}
				inputMode={inputMode}
				autoComplete={autoComplete}
				className={className}
				value={value.nationalNumber}
				onBlur={(event) => {
					onBlur?.(event);
					if (!event.defaultPrevented) breakHistoryGroup();
				}}
				onBeforeInput={(event) => {
					onBeforeInput?.(event);
					if (event.defaultPrevented) return;
					const selection = readSelection();
					rememberSelection(selection);
					pendingEditRef.current.selection = selection;
					const { inputType } = event.nativeEvent as InputEvent;
					if (inputType) {
						pendingEditRef.current.kind = getEditKind(inputType, selection);
					}
				}}
				onKeyDown={(event) => {
					onKeyDown?.(event);
					if (event.defaultPrevented) return;

					rememberSelection(readSelection());
					const key = event.key.toLowerCase();
					const hasPlatformModifier = event.metaKey || event.ctrlKey;
					const isUndo = hasPlatformModifier && key === "z" && !event.shiftKey;
					const isRedo =
						hasPlatformModifier &&
						((key === "z" && event.shiftKey) ||
							(key === "y" && !event.shiftKey));
					if (!event.altKey && (isUndo || isRedo)) {
						event.preventDefault();
						const target = isRedo ? redo() : undo();
						if (target) {
							pendingRestoreRef.current = target;
						}
						return;
					}
					const selection = readSelection();
					pendingEditRef.current.selection = selection;
					const keyboardInputType = getKeyboardInputType(event);
					if (keyboardInputType) {
						pendingEditRef.current.kind = getEditKind(
							keyboardInputType,
							selection,
						);
					} else if (
						["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
					) {
						breakHistoryGroup();
					}

					if (event.key !== "Backspace") return;

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

					pendingEditRef.current.kind = "unknown";
					setNumber(removeCharAt(element.value, digitIndex), "delete-backward");
					requestAnimationFrame(() => {
						element.setSelectionRange(digitIndex, digitIndex);
					});
				}}
				onInputCapture={(event) => {
					onInputCapture?.(event);
					if (event.defaultPrevented) return;
					const { inputType } = event.nativeEvent as InputEvent;
					if (inputType) {
						pendingEditRef.current.kind = getEditKind(
							inputType,
							pendingEditRef.current.selection,
						);
					}
				}}
				onSelect={(event) => {
					onSelect?.(event);
					rememberSelection(readSelection());
				}}
				onPointerDown={(event) => {
					onPointerDown?.(event);
					if (!event.defaultPrevented) breakHistoryGroup();
				}}
				onValueChange={(number) => {
					const editKind = pendingEditRef.current.kind;
					pendingEditRef.current.kind = "unknown";
					setNumber(number, editKind);
				}}
			/>
		);
	},
);
