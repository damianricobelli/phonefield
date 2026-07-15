import type { PhoneFieldInputValue, PhoneFieldValue } from "./types.js";

const HISTORY_LIMIT = 100;

export type PhoneFieldEditKind =
	| "insert"
	| "delete-backward"
	| "delete-forward"
	| "replace"
	| "paste"
	| "cut"
	| "drop"
	| "country"
	| "unknown";

export type PhoneFieldInputSelection = {
	start: number;
	end: number;
};

export type PhoneFieldHistorySnapshot = {
	value: PhoneFieldInputValue;
	selection: PhoneFieldInputSelection;
	kind: PhoneFieldEditKind;
};

export function toInputValue(value: PhoneFieldValue): PhoneFieldInputValue {
	return {
		countryIso2: value.countryIso2,
		nationalNumber: value.nationalNumber,
	};
}

function isSameValue(left: PhoneFieldInputValue, right: PhoneFieldInputValue) {
	return (
		left.countryIso2 === right.countryIso2 &&
		left.nationalNumber === right.nationalNumber
	);
}

function canCoalesce(kind: PhoneFieldEditKind) {
	return (
		kind === "insert" || kind === "delete-backward" || kind === "delete-forward"
	);
}

function pushSnapshot(
	history: PhoneFieldHistorySnapshot[],
	value: PhoneFieldInputValue,
	selection: PhoneFieldInputSelection,
	kind: PhoneFieldEditKind,
) {
	history.push({
		value: { ...value },
		selection: { ...selection },
		kind,
	});
	if (history.length > HISTORY_LIMIT) history.shift();
}

function digitPositions(value: string) {
	return Array.from(value.matchAll(/\d/g), (match) => match.index);
}

function getRestoredDeletionSelection(
	target: string,
	current: string,
	fallback: PhoneFieldInputSelection,
) {
	const targetPositions = digitPositions(target);
	const currentPositions = digitPositions(current);
	const targetDigits = targetPositions.map((position) => target[position]);
	const currentDigits = currentPositions.map((position) => current[position]);

	let prefixLength = 0;
	while (
		prefixLength < targetDigits.length &&
		prefixLength < currentDigits.length &&
		targetDigits[prefixLength] === currentDigits[prefixLength]
	) {
		prefixLength++;
	}

	let suffixLength = 0;
	while (
		suffixLength < targetDigits.length - prefixLength &&
		suffixLength < currentDigits.length - prefixLength &&
		targetDigits[targetDigits.length - 1 - suffixLength] ===
			currentDigits[currentDigits.length - 1 - suffixLength]
	) {
		suffixLength++;
	}

	const lastChangedDigit = targetDigits.length - suffixLength - 1;
	const start = targetPositions[prefixLength];
	const lastPosition = targetPositions[lastChangedDigit];
	if (start === undefined || lastPosition === undefined) return fallback;
	return { start, end: lastPosition + 1 };
}

export class PhoneFieldHistory {
	readonly #past: PhoneFieldHistorySnapshot[] = [];
	readonly #future: PhoneFieldHistorySnapshot[] = [];
	#activeKind: PhoneFieldEditKind | null = null;
	#expectedValue: PhoneFieldInputValue;

	constructor(initialValue: PhoneFieldInputValue) {
		this.#expectedValue = initialValue;
	}

	record(
		currentValue: PhoneFieldInputValue,
		nextValue: PhoneFieldInputValue,
		selection: PhoneFieldInputSelection,
		kind: PhoneFieldEditKind,
	) {
		this.#synchronize(currentValue);
		if (isSameValue(currentValue, nextValue)) return;

		if (this.#activeKind !== kind || !canCoalesce(kind)) {
			pushSnapshot(this.#past, currentValue, selection, kind);
		}
		this.#activeKind = canCoalesce(kind) ? kind : null;
		this.#future.length = 0;
		this.#expectedValue = nextValue;
	}

	breakGroup() {
		this.#activeKind = null;
	}

	undo(
		currentValue: PhoneFieldInputValue,
		selection: PhoneFieldInputSelection,
	) {
		const target = this.#transfer(
			this.#past,
			this.#future,
			currentValue,
			selection,
		);
		if (!target) return undefined;
		if (target.kind === "delete-backward" || target.kind === "delete-forward") {
			target.selection = getRestoredDeletionSelection(
				target.value.nationalNumber,
				currentValue.nationalNumber,
				target.selection,
			);
		}
		return target;
	}

	redo(
		currentValue: PhoneFieldInputValue,
		selection: PhoneFieldInputSelection,
	) {
		return this.#transfer(this.#future, this.#past, currentValue, selection);
	}

	#transfer(
		from: PhoneFieldHistorySnapshot[],
		to: PhoneFieldHistorySnapshot[],
		currentValue: PhoneFieldInputValue,
		selection: PhoneFieldInputSelection,
	) {
		if (!this.#synchronize(currentValue)) return undefined;

		const target = from.pop();
		if (!target) return undefined;
		pushSnapshot(to, currentValue, selection, target.kind);
		this.#activeKind = null;
		this.#expectedValue = target.value;
		return target;
	}

	#synchronize(currentValue: PhoneFieldInputValue) {
		if (isSameValue(this.#expectedValue, currentValue)) return true;

		this.#past.length = 0;
		this.#future.length = 0;
		this.#activeKind = null;
		this.#expectedValue = currentValue;
		return false;
	}
}
