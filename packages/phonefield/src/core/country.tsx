import React from "react";
import type { PhoneFieldCountry } from "../types.js";
import { defaultCountrySearchText } from "../utils.js";
import {
	PhoneFieldCountryLabelsContext,
	usePhoneFieldCountryContext,
} from "./context.js";

export const DEFAULT_SEARCH_LABEL = "Search country";
export const DEFAULT_EMPTY_LABEL = "No countries found";
export const EMPTY_LABELS = {};

/** Accessible name for a trigger that shows only the flag and dial code. */
export function getCountryTriggerLabel(country: PhoneFieldCountry) {
	return `${country.name} (${country.dialCode})`;
}

/** Default trigger content: flag and dial code. */
export function getCountryValueText(country: PhoneFieldCountry) {
	return `${country.flag ?? ""} ${country.dialCode}`.trim();
}

/** Default item content: flag, name, and dial code. */
export function getCountryItemText(country: PhoneFieldCountry) {
	return `${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})`;
}

/** An id usually means a `<label htmlFor>` names the trigger; keep that label. */
export function hasExplicitLabel(props: {
	id?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
}) {
	return (
		props["aria-label"] !== undefined ||
		props["aria-labelledby"] !== undefined ||
		props.id !== undefined
	);
}

/** Search copy, honoring `Country`'s `labels`. */
export function useCountryLabels() {
	const labels = React.use(PhoneFieldCountryLabelsContext);
	return {
		search: labels.search ?? DEFAULT_SEARCH_LABEL,
		empty: labels.empty ?? DEFAULT_EMPTY_LABEL,
	};
}

/**
 * Locale-aware substring matcher used by every adapter: ignores case and
 * accents, so "peru" finds "Perú" and "+54" finds Argentina.
 */
export function createCountryMatcher(locale: string) {
	const collator = new Intl.Collator(locale, {
		usage: "search",
		sensitivity: "base",
	});
	return (text: string, query: string) => {
		const needle = query.trim().normalize("NFC");
		if (!needle) return true;
		const haystack = text.normalize("NFC");
		const length = needle.length;
		for (let start = 0; start + length <= haystack.length; start++) {
			if (
				collator.compare(needle, haystack.slice(start, start + length)) === 0
			) {
				return true;
			}
		}
		return false;
	};
}

export function useCountryMatcher() {
	const { locale } = usePhoneFieldCountryContext();
	return React.useMemo(() => createCountryMatcher(locale), [locale]);
}

export function matchesCountry(
	matcher: (text: string, query: string) => boolean,
	country: PhoneFieldCountry,
	query: string,
) {
	return matcher(defaultCountrySearchText(country), query);
}

export function ChevronUpDownIcon(props: React.ComponentProps<"svg">) {
	return (
		<svg
			width="8"
			height="12"
			viewBox="0 0 8 12"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			{...props}
		>
			<path d="M0.5 4.5L4 1.5L7.5 4.5" />
			<path d="M0.5 7.5L4 10.5L7.5 7.5" />
		</svg>
	);
}

export function CheckIcon(props: React.ComponentProps<"svg">) {
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
			{...props}
		>
			<path d="M1 5.5L3.75 8L9 2" />
		</svg>
	);
}
