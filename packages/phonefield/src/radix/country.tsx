import * as Popover from "radix-ui/popover";
import * as Slot from "radix-ui/slot";
import React from "react";
import {
	PhoneFieldCountryLabelsContext,
	usePhoneFieldCountryContext,
} from "../core/context.js";
import {
	CheckIcon,
	ChevronUpDownIcon,
	EMPTY_LABELS,
	getCountryItemText,
	getCountryTriggerLabel,
	getCountryValueText,
	hasExplicitLabel,
	matchesCountry,
	useCountryLabels,
	useCountryMatcher,
} from "../core/country.js";
import { mergeRefs } from "../core/merge-refs.js";
import type { PhoneFieldCountry } from "../types.js";
import type { PhoneField } from "./component.js";

/** How long typed characters on the closed trigger build one typeahead query. */
const TYPEAHEAD_RESET_MS = 750;

type VisibleGroup = {
	id: "preferred" | "all";
	items: readonly PhoneFieldCountry[];
};

/**
 * Highlighted country, kept outside React state so moving the highlight
 * re-renders only the two affected items, not the whole list.
 */
type HighlightStore = {
	get: () => string | null;
	set: (iso2: string | null) => void;
	subscribe: (listener: () => void) => () => void;
};

function createHighlightStore(): HighlightStore {
	let highlighted: string | null = null;
	const listeners = new Set<() => void>();
	return {
		get: () => highlighted,
		set: (iso2) => {
			if (iso2 === highlighted) return;
			highlighted = iso2;
			for (const listener of listeners) listener();
		},
		subscribe: (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
	};
}

function getServerHighlight() {
	return null;
}

function getServerIsHighlighted() {
	return false;
}

/** Changes while the picker is used: open state, query, and visible countries. */
type RadixCountryStateContextValue = {
	open: boolean;
	query: string;
	visibleGroups: readonly VisibleGroup[];
	isEmpty: boolean;
	disabled: boolean;
	readOnly: boolean;
};

/** Stable while the picker is open, so items do not re-render on every keystroke. */
type RadixCountryActionsContextValue = {
	setOpen: (open: boolean) => void;
	setQuery: (query: string) => void;
	select: (country: PhoneFieldCountry) => void;
	highlight: HighlightStore;
	listId: string;
	listRef: React.RefObject<HTMLDivElement | null>;
	getItemId: (iso2: string) => string;
};

const RadixCountryStateContext =
	React.createContext<RadixCountryStateContextValue | null>(null);
const RadixCountryActionsContext =
	React.createContext<RadixCountryActionsContextValue | null>(null);

function useRadixCountryState(part: string) {
	const context = React.use(RadixCountryStateContext);
	if (!context) {
		throw new Error(`${part} must be used inside <PhoneField.Country>.`);
	}
	return context;
}

function useRadixCountryActions(part: string) {
	const context = React.use(RadixCountryActionsContext);
	if (!context) {
		throw new Error(`${part} must be used inside <PhoneField.Country>.`);
	}
	return context;
}

function useHighlighted(highlight: HighlightStore) {
	return React.useSyncExternalStore(
		highlight.subscribe,
		highlight.get,
		getServerHighlight,
	);
}

function useIsHighlighted(highlight: HighlightStore, iso2: string) {
	return React.useSyncExternalStore(
		highlight.subscribe,
		() => highlight.get() === iso2,
		getServerIsHighlighted,
	);
}

const ItemContext = React.createContext<{ selected: boolean } | null>(null);

function getOptions(list: HTMLElement | null) {
	return Array.from(
		list?.querySelectorAll<HTMLElement>(
			'[role="option"]:not([aria-disabled="true"])',
		) ?? [],
	);
}

function scrollOptionIntoView(list: HTMLElement | null, iso2: string | null) {
	if (!list || !iso2) return;
	const option = list.querySelector<HTMLElement>(
		`[role="option"][data-country="${iso2}"]`,
	);
	option?.scrollIntoView?.({ block: "nearest" });
}

function DefaultCountryAnatomy() {
	return (
		<>
			<CountryTrigger />
			<CountryPortal>
				<CountryContent>
					<CountrySearch />
					<CountryEmpty />
					<CountryList />
				</CountryContent>
			</CountryPortal>
		</>
	);
}

function CountryComponent({
	children,
	labels,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	disabled: disabledProp,
	readOnly: readOnlyProp,
	...props
}: PhoneField.CountryProps) {
	const {
		selectedCountry,
		availableCountries,
		groups,
		disabled: fieldDisabled,
		readOnly: fieldReadOnly,
		setCountry,
	} = usePhoneFieldCountryContext();
	const disabled = fieldDisabled || !!disabledProp;
	const readOnly = fieldReadOnly || !!readOnlyProp;

	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const open = !disabled && (openProp ?? uncontrolledOpen);
	const [query, setQuery] = React.useState("");
	const [highlight] = React.useState(createHighlightStore);
	const onOpenChangeRef = React.useRef(onOpenChange);
	React.useLayoutEffect(() => {
		onOpenChangeRef.current = onOpenChange;
	});
	const setOpen = React.useCallback(
		(next: boolean) => {
			if (next && disabled) return;
			setUncontrolledOpen(next);
			onOpenChangeRef.current?.(next);
			if (!next) setQuery("");
		},
		[disabled],
	);

	const matcher = useCountryMatcher();
	const visibleGroups = React.useMemo<readonly VisibleGroup[]>(() => {
		const source: readonly VisibleGroup[] = groups ?? [
			{ id: "all", items: availableCountries },
		];
		if (!query.trim()) return source;
		return source
			.map((group) => ({
				id: group.id,
				items: group.items.filter((country) =>
					matchesCountry(matcher, country, query),
				),
			}))
			.filter((group) => group.items.length > 0);
	}, [availableCountries, groups, matcher, query]);
	const isEmpty = visibleGroups.every((group) => group.items.length === 0);

	const listId = React.useId();
	const listRef = React.useRef<HTMLDivElement>(null);
	const getItemId = React.useCallback(
		(iso2: string) => `${listId}-${iso2}`,
		[listId],
	);
	const select = React.useCallback(
		(country: PhoneFieldCountry) => {
			if (readOnly) return;
			if (country.iso2 !== selectedCountry.iso2) setCountry(country);
			setOpen(false);
		},
		[readOnly, selectedCountry.iso2, setCountry, setOpen],
	);

	const state = React.useMemo<RadixCountryStateContextValue>(
		() => ({ open, query, visibleGroups, isEmpty, disabled, readOnly }),
		[disabled, isEmpty, open, query, readOnly, visibleGroups],
	);
	const actions = React.useMemo<RadixCountryActionsContextValue>(
		() => ({
			setOpen,
			setQuery,
			select,
			highlight,
			listId,
			listRef,
			getItemId,
		}),
		[getItemId, highlight, listId, select, setOpen],
	);

	return (
		<Popover.Root {...props} open={open} onOpenChange={setOpen}>
			<RadixCountryActionsContext value={actions}>
				<RadixCountryStateContext value={state}>
					<PhoneFieldCountryLabelsContext value={labels ?? EMPTY_LABELS}>
						{children ?? <DefaultCountryAnatomy />}
					</PhoneFieldCountryLabelsContext>
				</RadixCountryStateContext>
			</RadixCountryActionsContext>
		</Popover.Root>
	);
}

/**
 * Country picker state, built on Radix Popover. Without children it renders
 * a complete, unstyled picker; compose the `Country*` parts to customize it.
 */
export const Country = React.memo(CountryComponent);

/**
 * Button that opens the picker. Defaults to the selected flag, dial code, and
 * an icon. Typing on the closed trigger selects a country by name.
 */
export function CountryTrigger({
	children,
	onKeyDown,
	...props
}: PhoneField.CountryTriggerProps) {
	const { selectedCountry, availableCountries, groups } =
		usePhoneFieldCountryContext("PhoneField.CountryTrigger");
	const { open, disabled, readOnly } = useRadixCountryState(
		"PhoneField.CountryTrigger",
	);
	const { setOpen, select } = useRadixCountryActions(
		"PhoneField.CountryTrigger",
	);
	const typeaheadRef = React.useRef({ query: "", timeout: 0 });
	React.useEffect(() => () => clearTimeout(typeaheadRef.current.timeout), []);

	const orderedCountries = React.useMemo(
		() =>
			groups ? groups.flatMap((group) => group.items) : availableCountries,
		[availableCountries, groups],
	);

	function typeahead(character: string) {
		const state = typeaheadRef.current;
		clearTimeout(state.timeout);
		state.query += character.toLocaleLowerCase();
		state.timeout = window.setTimeout(() => {
			state.query = "";
		}, TYPEAHEAD_RESET_MS);
		const repeated = [...state.query].every((char) => char === state.query[0]);
		const search = repeated ? state.query[0] : state.query;
		const current = orderedCountries.findIndex(
			(country) => country.iso2 === selectedCountry.iso2,
		);
		const start = repeated ? current + 1 : current;
		for (let offset = 0; offset < orderedCountries.length; offset++) {
			const country =
				orderedCountries[(start + offset) % orderedCountries.length];
			if (country?.name.toLocaleLowerCase().startsWith(search ?? "")) {
				if (country.iso2 !== selectedCountry.iso2) select(country);
				return;
			}
		}
	}

	return (
		<Popover.Trigger
			role="combobox"
			aria-haspopup="dialog"
			aria-readonly={readOnly || undefined}
			aria-label={
				hasExplicitLabel(props)
					? undefined
					: getCountryTriggerLabel(selectedCountry)
			}
			disabled={disabled}
			data-disabled={disabled ? "" : undefined}
			data-readonly={readOnly ? "" : undefined}
			{...props}
			data-slot="phone-field-country-trigger"
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					setOpen(true);
					return;
				}
				const isCharacter =
					event.key.length === 1 &&
					event.key !== " " &&
					!event.metaKey &&
					!event.ctrlKey &&
					!event.altKey;
				if (!open && !readOnly && isCharacter) {
					event.preventDefault();
					typeahead(event.key);
				}
			}}
		>
			{children ?? (
				<>
					<CountryValue />
					<CountryIcon />
				</>
			)}
		</Popover.Trigger>
	);
}

/** Selected country text. Pass a function child to render it yourself. */
export function CountryValue({ children }: PhoneField.CountryValueProps) {
	const { selectedCountry } = usePhoneFieldCountryContext(
		"PhoneField.CountryValue",
	);
	if (typeof children === "function") return <>{children(selectedCountry)}</>;
	return <>{children ?? getCountryValueText(selectedCountry)}</>;
}

/** Decorative trigger icon. Defaults to an up/down chevron. */
export function CountryIcon({
	asChild,
	children,
	...props
}: PhoneField.CountryIconProps) {
	const Component = asChild ? Slot.Root : "span";
	return (
		<Component
			aria-hidden="true"
			{...props}
			data-slot="phone-field-country-icon"
		>
			{children ?? <ChevronUpDownIcon />}
		</Component>
	);
}

/** Portals the content to `document.body`. */
export function CountryPortal(props: PhoneField.CountryPortalProps) {
	return <Popover.Portal {...props} />;
}

/**
 * Positioned popup container. Defaults to `side="bottom"`, `align="start"`,
 * `sideOffset={4}`. Focus moves to the search box when it opens.
 */
export function CountryContent(props: PhoneField.CountryContentProps) {
	return (
		<Popover.Content
			side="bottom"
			align="start"
			sideOffset={4}
			{...props}
			data-slot="phone-field-country-content"
		/>
	);
}

function moveHighlight(
	{ highlight, listRef }: RadixCountryActionsContextValue,
	direction: "next" | "previous" | "first" | "last",
) {
	const options = getOptions(listRef.current);
	if (options.length === 0) return;
	const current = highlight.get();
	const index = options.findIndex(
		(option) => option.dataset.country === current,
	);
	let nextIndex: number;
	if (direction === "first") nextIndex = 0;
	else if (direction === "last") nextIndex = options.length - 1;
	else if (index === -1)
		nextIndex = direction === "next" ? 0 : options.length - 1;
	else if (direction === "next") nextIndex = (index + 1) % options.length;
	else nextIndex = (index - 1 + options.length) % options.length;
	const next = options[nextIndex]?.dataset.country ?? null;
	highlight.set(next);
	scrollOptionIntoView(listRef.current, next);
}

/** Search box that filters by name, ISO2 code, or dial code. */
export function CountrySearch({
	asChild,
	placeholder: placeholderProp,
	onChange,
	onKeyDown,
	...props
}: PhoneField.CountrySearchProps) {
	const labels = useCountryLabels();
	const { getCountry } = usePhoneFieldCountryContext(
		"PhoneField.CountrySearch",
	);
	const { query, open } = useRadixCountryState("PhoneField.CountrySearch");
	const actions = useRadixCountryActions("PhoneField.CountrySearch");
	const { setQuery, highlight, listId, listRef, getItemId, select } = actions;
	const highlighted = useHighlighted(highlight);
	const placeholder = placeholderProp ?? labels.search;
	const Component = asChild ? Slot.Root : "input";
	return (
		<Component
			type="text"
			role="combobox"
			autoComplete="off"
			autoCorrect="off"
			autoCapitalize="none"
			spellCheck={false}
			aria-autocomplete="list"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-controls={listId}
			aria-activedescendant={highlighted ? getItemId(highlighted) : undefined}
			placeholder={placeholder}
			aria-label={props["aria-labelledby"] ? undefined : placeholder}
			{...props}
			value={query}
			data-slot="phone-field-country-search"
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				onChange?.(event);
				setQuery(event.currentTarget.value);
			}}
			onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				switch (event.key) {
					case "ArrowDown":
						event.preventDefault();
						moveHighlight(actions, "next");
						break;
					case "ArrowUp":
						event.preventDefault();
						moveHighlight(actions, "previous");
						break;
					case "PageDown":
						event.preventDefault();
						moveHighlight(actions, "last");
						break;
					case "PageUp":
						event.preventDefault();
						moveHighlight(actions, "first");
						break;
					case "Enter": {
						// The search lives in a popup: Enter never submits the form.
						event.preventDefault();
						const country = highlighted ? getCountry(highlighted) : undefined;
						const option = listRef.current?.querySelector(
							`[role="option"][data-country="${highlighted}"]`,
						);
						if (!country || option?.getAttribute("aria-disabled") === "true") {
							return;
						}
						select(country);
						break;
					}
				}
			}}
		/>
	);
}

/** Shown when the search has no matches. Announced politely to screen readers. */
export function CountryEmpty({
	asChild,
	children,
	...props
}: PhoneField.CountryEmptyProps) {
	const labels = useCountryLabels();
	const { isEmpty } = useRadixCountryState("PhoneField.CountryEmpty");
	const Component = asChild ? Slot.Root : "div";
	return (
		<Component
			role="status"
			aria-live="polite"
			aria-atomic="true"
			{...props}
			data-slot="phone-field-country-empty"
		>
			{isEmpty ? (children ?? labels.empty) : null}
		</Component>
	);
}

/**
 * Filtered country list. Pass a function child to render each country; keys
 * are handled for you. With `preferredCountries`, pinned countries render in
 * a separate `data-slot="phone-field-country-group"` with `data-preferred`.
 */
export function CountryList({
	children,
	ref,
	...props
}: PhoneField.CountryListProps) {
	const { selectedCountry, groups } = usePhoneFieldCountryContext(
		"PhoneField.CountryList",
	);
	const { visibleGroups, isEmpty, query } = useRadixCountryState(
		"PhoneField.CountryList",
	);
	const { listId, listRef, highlight } = useRadixCountryActions(
		"PhoneField.CountryList",
	);
	const mergedRef = React.useCallback(
		(element: HTMLDivElement | null) => mergeRefs(ref, listRef)(element),
		[ref, listRef],
	);

	// On open, highlight the selected country and bring it into view. The list
	// mounts each time the content opens.
	const didHighlightRef = React.useRef(false);
	React.useLayoutEffect(() => {
		if (didHighlightRef.current) return;
		didHighlightRef.current = true;
		const list = listRef.current;
		const selected = getOptions(list).find(
			(option) => option.dataset.country === selectedCountry.iso2,
		);
		const initial = selected?.dataset.country ?? null;
		highlight.set(initial);
		scrollOptionIntoView(list, initial);
	}, [highlight, listRef, selectedCountry.iso2]);

	// While searching, highlight the first match.
	const previousQueryRef = React.useRef(query);
	React.useLayoutEffect(() => {
		if (previousQueryRef.current === query) return;
		previousQueryRef.current = query;
		const first = getOptions(listRef.current)[0]?.dataset.country ?? null;
		highlight.set(query.trim() ? first : null);
		if (listRef.current) listRef.current.scrollTop = 0;
	}, [highlight, listRef, query]);

	const renderCountry = (country: PhoneFieldCountry) => (
		<React.Fragment key={country.iso2}>
			{children ? children(country) : <CountryItem country={country} />}
		</React.Fragment>
	);

	return (
		<div
			role="listbox"
			tabIndex={-1}
			{...props}
			ref={mergedRef}
			id={listId}
			data-slot="phone-field-country-list"
			data-empty={isEmpty ? "" : undefined}
		>
			{groups
				? visibleGroups.map((group) => (
						// biome-ignore lint/a11y/useSemanticElements: a listbox only allows role="group" containers, not <fieldset>.
						<div
							key={group.id}
							role="group"
							data-slot="phone-field-country-group"
							data-preferred={group.id === "preferred" ? "" : undefined}
						>
							{group.items.map(renderCountry)}
						</div>
					))
				: visibleGroups[0]?.items.map(renderCountry)}
		</div>
	);
}

/** One selectable country. Defaults to flag, name, and dial code. */
export function CountryItem({
	asChild,
	country,
	disabled = false,
	children,
	onClick,
	onMouseDown,
	onPointerMove,
	...props
}: PhoneField.CountryItemProps) {
	const { selectedCountry } = usePhoneFieldCountryContext(
		"PhoneField.CountryItem",
	);
	const { highlight, getItemId, select } = useRadixCountryActions(
		"PhoneField.CountryItem",
	);
	const selected = selectedCountry.iso2 === country.iso2;
	const isHighlighted = useIsHighlighted(highlight, country.iso2);
	const itemContext = React.useMemo(() => ({ selected }), [selected]);
	const Component = asChild ? Slot.Root : "div";
	return (
		<ItemContext value={itemContext}>
			<Component
				role="option"
				{...props}
				id={getItemId(country.iso2)}
				aria-selected={selected}
				aria-disabled={disabled || undefined}
				data-slot="phone-field-country-item"
				data-country={country.iso2}
				data-state={selected ? "checked" : "unchecked"}
				data-selected={selected ? "" : undefined}
				data-highlighted={isHighlighted ? "" : undefined}
				data-disabled={disabled ? "" : undefined}
				onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
					onMouseDown?.(event);
					// Keep focus in the search box, like a native listbox popup.
					event.preventDefault();
				}}
				onPointerMove={(event: React.PointerEvent<HTMLDivElement>) => {
					onPointerMove?.(event);
					if (!disabled && !isHighlighted) highlight.set(country.iso2);
				}}
				onClick={(event: React.MouseEvent<HTMLDivElement>) => {
					onClick?.(event);
					if (!event.defaultPrevented && !disabled) select(country);
				}}
			>
				{children ?? getCountryItemText(country)}
			</Component>
		</ItemContext>
	);
}

/** Rendered inside an item only while it is selected. Defaults to a check mark. */
export function CountryItemIndicator({
	asChild,
	children,
	...props
}: PhoneField.CountryItemIndicatorProps) {
	const item = React.use(ItemContext);
	if (!item) {
		throw new Error(
			"PhoneField.CountryItemIndicator must be used inside <PhoneField.CountryItem>.",
		);
	}
	if (!item.selected) return null;
	const Component = asChild ? Slot.Root : "span";
	return (
		<Component
			aria-hidden="true"
			{...props}
			data-slot="phone-field-country-item-indicator"
		>
			{children ?? <CheckIcon />}
		</Component>
	);
}
