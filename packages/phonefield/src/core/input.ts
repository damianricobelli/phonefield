import React from "react";
import type { PhoneFieldCountry } from "../types.js";
import { useIsomorphicLayoutEffect } from "./compat.js";
import {
	usePhoneFieldCountryContext,
	usePhoneFieldInputContext,
	usePhoneFieldStateContext,
} from "./context.js";
import type {
	PhoneFieldEditKind,
	PhoneFieldHistorySnapshot,
	PhoneFieldInputSelection,
} from "./history.js";
import { mergeRefs } from "./merge-refs.js";

/** Keys that move the caret end the current undo transaction. */
const CARET_MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "Home", "End"]);

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

class PlusInputPolicy {
	#allowNextPaste = false;

	armPaste() {
		this.#allowNextPaste = true;
		setTimeout(() => {
			this.#allowNextPaste = false;
		}, 0);
	}

	reset() {
		this.#allowNextPaste = false;
	}

	shouldBlock(event: InputEvent) {
		const isPaste =
			this.#allowNextPaste || event.inputType?.startsWith("insertFromPaste");
		this.reset();
		return !isPaste && event.data?.includes("+");
	}
}

function replaceSelection(
	value: string,
	selection: PhoneFieldInputSelection,
	text: string,
) {
	return value.slice(0, selection.start) + text + value.slice(selection.end);
}

/**
 * `onBeforeInput` is typed as `InputEventHandler` by React 19's types and as
 * `FormEventHandler` by React 18's. Read it from the installed types.
 */
type BeforeInputHandler = NonNullable<
	React.DOMAttributes<HTMLInputElement>["onBeforeInput"]
>;
type BeforeInputEvent = Parameters<BeforeInputHandler>[0];

/** Native input props PhoneField composes with its own behavior. */
export type PhoneFieldNativeInputProps = {
	ref?: React.Ref<HTMLInputElement>;
	"data-slot"?: string;
	id?: string;
	placeholder?: string | ((country: PhoneFieldCountry) => string | undefined);
	type?: React.HTMLInputTypeAttribute;
	inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
	autoComplete?: React.HTMLInputAutoCompleteAttribute;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	"aria-invalid"?: React.AriaAttributes["aria-invalid"];
	"aria-describedby"?: string;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onInvalid?: React.FormEventHandler<HTMLInputElement>;
	onBeforeInput?: BeforeInputHandler;
	onInputCapture?: React.FormEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
	onPointerDown?: React.PointerEventHandler<HTMLInputElement>;
	onSelect?: React.ReactEventHandler<HTMLInputElement>;
};

/** Props `usePhoneFieldInput` returns for the rendered `<input>`. */
export type PhoneFieldInputElementProps = {
	ref: React.RefCallback<HTMLInputElement>;
	"data-slot": string;
	id: string;
	"aria-describedby": string | undefined;
	type: React.HTMLInputTypeAttribute;
	inputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"];
	autoComplete: React.HTMLInputAutoCompleteAttribute;
	placeholder: string | undefined;
	disabled: boolean;
	readOnly: boolean;
	required: boolean;
	"aria-invalid": React.AriaAttributes["aria-invalid"];
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	onInvalid: React.FormEventHandler<HTMLInputElement>;
	onBlur: React.FocusEventHandler<HTMLInputElement>;
	onBeforeInput: BeforeInputHandler;
	onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
	onInputCapture: React.FormEventHandler<HTMLInputElement>;
	onSelect: React.ReactEventHandler<HTMLInputElement>;
	onPaste: React.ClipboardEventHandler<HTMLInputElement>;
	onPointerDown: React.PointerEventHandler<HTMLInputElement>;
};

/**
 * Behavior of `PhoneField.Input`: formatting, paste detection, length limits,
 * and native-style undo. Returns props for any element that renders an `<input>`.
 */
export function usePhoneFieldInput<P extends PhoneFieldNativeInputProps>(
	props: P,
): Omit<P, keyof PhoneFieldNativeInputProps> & PhoneFieldInputElementProps {
	const {
		ref: forwardedRef,
		"data-slot": dataSlot = "phone-field-input",
		id: idProp,
		placeholder,
		type = "tel",
		inputMode = "tel",
		autoComplete = "tel-national",
		disabled,
		readOnly,
		required,
		"aria-invalid": ariaInvalid,
		"aria-describedby": ariaDescribedBy,
		onBlur,
		onChange,
		onInvalid,
		onBeforeInput,
		onInputCapture,
		onKeyDown,
		onPaste,
		onPointerDown,
		onSelect,
		...rest
	} = props;
	const {
		state,
		controlId,
		setControlId,
		descriptionId,
		errorId,
		markTouched,
	} = usePhoneFieldStateContext("PhoneField.Input");
	const {
		value,
		inputRef: rootInputRef,
		setNumber,
		accepts,
		rememberSelection,
		breakHistoryGroup,
		undo,
		redo,
	} = usePhoneFieldInputContext();
	const { selectedCountry } = usePhoneFieldCountryContext("PhoneField.Input");
	const inputRef = React.useRef<HTMLInputElement>(null);
	// A custom id becomes the field's control id so PhoneField.Label follows it.
	useIsomorphicLayoutEffect(() => {
		setControlId(idProp);
		return () => setControlId(undefined);
	}, [idProp, setControlId]);
	const describedBy =
		[ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
		undefined;
	const plusInputPolicyRef = React.useRef(new PlusInputPolicy());
	const pendingEditRef = React.useRef<{
		kind: PhoneFieldEditKind;
		selection: PhoneFieldInputSelection;
	}>({ kind: "unknown", selection: { start: 0, end: 0 } });
	const pendingRestoreRef = React.useRef<PhoneFieldHistorySnapshot | null>(
		null,
	);
	const mergedRef = React.useCallback(
		(element: HTMLInputElement | null) =>
			mergeRefs(forwardedRef, inputRef, rootInputRef)(element),
		[forwardedRef, rootInputRef],
	);
	const readSelection = React.useCallback(() => {
		const element = inputRef.current;
		return {
			start: element?.selectionStart ?? 0,
			end: element?.selectionEnd ?? 0,
		};
	}, []);
	useIsomorphicLayoutEffect(() => {
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

	const handleValue = (number: string) => {
		const editKind = pendingEditRef.current.kind;
		const selection = pendingEditRef.current.selection;
		pendingEditRef.current.kind = "unknown";
		if (setNumber(number, editKind)) return;
		// Rejected (too long): React restores the controlled value; put the
		// caret back where the user left it.
		const element = inputRef.current;
		requestAnimationFrame(() => {
			element?.setSelectionRange(selection.start, selection.end);
		});
	};

	const inputProps: PhoneFieldInputElementProps = {
		ref: mergedRef,
		"data-slot": dataSlot,
		id: idProp ?? controlId,
		"aria-describedby": describedBy,
		type,
		inputMode,
		autoComplete,
		placeholder:
			typeof placeholder === "function"
				? placeholder(selectedCountry)
				: placeholder,
		disabled: disabled ?? state.disabled,
		readOnly: readOnly ?? state.readOnly,
		required: required ?? state.required,
		"aria-invalid": ariaInvalid ?? (state.invalid || undefined),
		value: value.nationalNumber,
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(event);
			handleValue(event.currentTarget.value);
		},
		onInvalid: (event: React.FormEvent<HTMLInputElement>) => {
			onInvalid?.(event);
			markTouched();
		},
		onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
			onBlur?.(event);
			if (!event.defaultPrevented) breakHistoryGroup();
		},
		onBeforeInput: (event: BeforeInputEvent) => {
			onBeforeInput?.(event);
			const nativeEvent = event.nativeEvent as InputEvent;
			if (event.defaultPrevented) return;
			if (plusInputPolicyRef.current.shouldBlock(nativeEvent)) {
				event.preventDefault();
				pendingEditRef.current.kind = "unknown";
				return;
			}
			const selection = readSelection();
			const element = inputRef.current;
			if (
				element &&
				nativeEvent.data &&
				nativeEvent.inputType?.startsWith("insert") &&
				!accepts(replaceSelection(element.value, selection, nativeEvent.data))
			) {
				event.preventDefault();
				pendingEditRef.current.kind = "unknown";
				return;
			}
			rememberSelection(selection);
			pendingEditRef.current.selection = selection;
			const { inputType } = nativeEvent;
			if (inputType) {
				pendingEditRef.current.kind = getEditKind(inputType, selection);
			}
		},
		onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(event);
			if (event.defaultPrevented) return;
			plusInputPolicyRef.current.reset();

			rememberSelection(readSelection());
			const key = event.key.toLowerCase();
			const hasPlatformModifier = event.metaKey || event.ctrlKey;
			const isUndo = hasPlatformModifier && key === "z" && !event.shiftKey;
			const isRedo =
				hasPlatformModifier &&
				((key === "z" && event.shiftKey) || (key === "y" && !event.shiftKey));
			if (!event.altKey && (isUndo || isRedo)) {
				event.preventDefault();
				const target = isRedo ? redo() : undo();
				if (target) {
					pendingRestoreRef.current = target;
				}
				return;
			}
			if (event.key === "+" && !event.metaKey && !event.ctrlKey) {
				event.preventDefault();
				pendingEditRef.current.kind = "unknown";
				return;
			}
			const selection = readSelection();
			pendingEditRef.current.selection = selection;
			const keyboardInputType = getKeyboardInputType(event);
			if (keyboardInputType) {
				pendingEditRef.current.kind = getEditKind(keyboardInputType, selection);
			} else if (CARET_MOVE_KEYS.has(event.key)) {
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

			const digitIndex = findPrevDigitIndex(element.value, start);
			if (digitIndex < 0) return;
			event.preventDefault();

			pendingEditRef.current.kind = "unknown";
			setNumber(removeCharAt(element.value, digitIndex), "delete-backward");
			requestAnimationFrame(() => {
				element.setSelectionRange(digitIndex, digitIndex);
			});
		},
		onInputCapture: (event: React.FormEvent<HTMLInputElement>) => {
			onInputCapture?.(event);
			plusInputPolicyRef.current.reset();
			if (event.defaultPrevented) return;
			const { inputType } = event.nativeEvent as InputEvent;
			if (inputType) {
				pendingEditRef.current.kind = getEditKind(
					inputType,
					pendingEditRef.current.selection,
				);
			}
		},
		onSelect: (event: React.SyntheticEvent<HTMLInputElement>) => {
			onSelect?.(event);
			rememberSelection(readSelection());
		},
		onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => {
			onPaste?.(event);
			if (event.defaultPrevented) return;
			const element = inputRef.current;
			const text = event.clipboardData?.getData("text") ?? "";
			if (
				element &&
				text &&
				!accepts(replaceSelection(element.value, readSelection(), text))
			) {
				event.preventDefault();
				return;
			}
			plusInputPolicyRef.current.armPaste();
		},
		onPointerDown: (event: React.PointerEvent<HTMLInputElement>) => {
			onPointerDown?.(event);
			if (!event.defaultPrevented) breakHistoryGroup();
		},
	};

	return { ...rest, ...inputProps };
}
