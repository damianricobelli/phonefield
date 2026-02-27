"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Input as BaseInput } from "@base-ui/react/input";
import React from "react";
import { cn } from "./internal/cn";
import type {
  PhoneFieldCountry,
  PhoneFieldCountryCodeValue,
  PhoneFieldCountryMap,
  PhoneFieldCountryName,
  PhoneFieldLang,
  PhoneFieldValue,
} from "./types";
import {
  buildValue,
  defaultCountrySearchText,
  getCountriesMap,
  resolveCountry,
  toAvailableCountries,
} from "./utils";

type PhoneFieldContextValue = {
  value: PhoneFieldValue;
  selectedCountry: PhoneFieldCountry;
  availableCountries: readonly PhoneFieldCountry[];
  setCountry: (country: PhoneFieldCountry) => void;
  setNumber: (number: string) => void;
  renderCountryItem?: PhoneField.RenderCountryItem;
  renderCountryValue?: PhoneField.RenderCountryValue;
};

const PhoneFieldContext = React.createContext<PhoneFieldContextValue | null>(
  null,
);

function usePhoneFieldContext() {
  const ctx = React.useContext(PhoneFieldContext);
  if (!ctx) {
    throw new Error(
      "PhoneField compound components must be used inside <PhoneField.Root>.",
    );
  }
  return ctx;
}

function ChevronUpDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <title>Arrow</title>
      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
    </svg>
  );
}

/**
 * Root container for the phone field. Provides context to Country and Input.
 * Supports controlled and uncontrolled usage, optional FormData serialization via `name`, and country subset.
 */
function Root({
  value,
  defaultValue,
  onValueChange,
  defaultCountry,
  countries,
  lang,
  name,
  formatOnType = true,
  children,
  className,
  ...props
}: PhoneField.RootProps) {
  const countriesMap = React.useMemo(() => getCountriesMap(lang), [lang]);
  const availableCountries = React.useMemo(
    () => toAvailableCountries(countriesMap, countries),
    [countriesMap, countries],
  );
  const initialCountry = resolveCountry(availableCountries, defaultCountry);

  const [internalValue, setInternalValue] = React.useState<PhoneField.Value>(
    defaultValue ?? buildValue(initialCountry, "", formatOnType),
  );

  const currentValue = value ?? internalValue;
  const selectedCountry = resolveCountry(
    availableCountries,
    currentValue.countryIso2,
  );
  const normalizedValue = buildValue(
    selectedCountry,
    currentValue.nationalNumber,
    formatOnType,
  );

  const commitValue = (nextCountry: PhoneField.Country, nextNumber: string) => {
    const nextValue = buildValue(nextCountry, nextNumber, formatOnType);
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const contextValue: PhoneFieldContextValue = {
    value: normalizedValue,
    selectedCountry,
    availableCountries,
    setCountry: (country) =>
      commitValue(country, normalizedValue.nationalNumber),
    setNumber: (number) => commitValue(selectedCountry, number),
  };

  return (
    <PhoneFieldContext.Provider value={contextValue}>
      <div className={className} {...props}>
        {children}
        {name ? (
          <input
            type="hidden"
            name={name}
            value={JSON.stringify(normalizedValue)}
          />
        ) : null}
      </div>
    </PhoneFieldContext.Provider>
  );
}

/**
 * Country combobox: trigger + searchable list. Use `slots` to style trigger, popup, list, item, etc.
 */
function Country({
  placeholder = "Select country",
  noResultsText = "No countries found",
  inputPlaceholder = "Search country",
  icon,
  slots,
  renderCountryItem,
  renderCountryValue,
}: PhoneField.CountryProps) {
  const {
    selectedCountry,
    availableCountries,
    setCountry,
  } = usePhoneFieldContext();

  const selectedInList =
    availableCountries.find(
      (country) => country.iso2 === selectedCountry.iso2,
    ) ?? availableCountries[0];

  return (
      <Combobox.Root
        {...slots?.root}
        items={availableCountries}
        value={selectedInList}
        itemToStringLabel={defaultCountrySearchText}
        onValueChange={(next) => {
          if (!next) {
            return;
          }
          setCountry(next);
        }}
        isItemEqualToValue={(a, b) => a.iso2 === b.iso2}
      >
        <Combobox.Trigger {...slots?.trigger}>
            <Combobox.Value {...slots?.value} placeholder={placeholder}>
              {(country: PhoneField.Country | null) => {
                return country ? renderCountryValue?.(country) ?? `${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})` : placeholder;
              }}
            </Combobox.Value>
          <Combobox.Icon {...slots?.icon}>
            {icon ?? <ChevronUpDownIcon />}
          </Combobox.Icon>
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner align="start" sideOffset={4} {...slots?.positioner}>
            <Combobox.Popup {...slots?.popup}>
              <Combobox.Input
                {...slots?.searchInput}
                placeholder={inputPlaceholder}
                aria-label={inputPlaceholder}
              />
              <Combobox.Empty {...slots?.empty}>
                {noResultsText}
              </Combobox.Empty>
              <Combobox.List {...slots?.list}>
                {(country: PhoneField.Country) => (
                  <Combobox.Item
                    key={country.iso2}
                    value={country}
                    {...slots?.item}
                  >
                    {renderCountryItem?.(country) ?? (
                      <div className="flex items-center justify-between gap-4">
                        <span className="truncate">
                          {country.flag ? `${country.flag} ` : ""}
                          {country.name}
                        </span>
                        <span className="text-xs opacity-70">
                          {country.iso2} · {country.dialCode}
                        </span>
                      </div>
                    )}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
  );
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;

      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.RefObject<T | null>).current = value;
      }
    }
  };
}

function removeCharAt(value: string, index: number) {
  return value.slice(0, index) + value.slice(index + 1);
}

function findPrevDigitIndex(value: string, from: number) {
  let i = from;
  while (i > 0 && /\D/.test(value[i - 1] ?? "")) {
    i--;
  }
  return i - 1;
}

/**
 * Number input bound to the selected country. Exposes `data-valid` / `data-invalid` from Base UI Input.
 */
const Input = ({
  className,
  onValueChange,
  type = "text",
  onKeyDown,
  ref,
  ...props
}: PhoneField.InputProps) => {
  const { value, setNumber } = usePhoneFieldContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const baseInputClassName =
    "h-10 rounded-md border border-zinc-300 px-3 flex-1 outline-none focus:border-zinc-500";
  const resolvedClassName: BaseInput.Props["className"] =
    typeof className === "function"
      ? (state) => cn(baseInputClassName, className(state))
      : cn(baseInputClassName, className);

  return (
    <BaseInput
      {...props}
      ref={mergeRefs(ref, inputRef)}
      type={type}
      inputMode="tel"
      autoComplete="tel"
      pattern="[0-9]*"
      className={resolvedClassName}
      value={value.nationalNumber}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          const el = inputRef.current;
          if (!el) return;

          const pos = el.selectionStart ?? 0;
          const end = el.selectionEnd ?? 0;

          if (pos === end && pos > 0) {
            const prevChar = el.value[pos - 1];

            if (prevChar && /\D/.test(prevChar)) {
              e.preventDefault();

              const digitIndex = findPrevDigitIndex(el.value, pos);
              if (digitIndex >= 0) {
                const next = removeCharAt(el.value, digitIndex);
                setNumber(next);

                requestAnimationFrame(() => {
                  const newPos = digitIndex;
                  el.setSelectionRange(newPos, newPos);
                });
              }
            }
          }
        }

        onKeyDown?.(e);
      }}
      onValueChange={(nextValue, eventDetails) => {
        setNumber(nextValue);
        onValueChange?.(nextValue, eventDetails);
      }}
    />
  );
};

export const PhoneField = {
  Root,
  Country,
  Input
};

export namespace PhoneField {
  /** Country descriptor: iso2, name, dialCode, flag. */
  export type Country = PhoneFieldCountry;
  /** Read-only map of ISO2 to country. */
  export type CountryMap = PhoneFieldCountryMap;
  /** ISO2 country code (e.g. "US", "GB"). */
  export type CountryCodeValue = PhoneFieldCountryCodeValue;
  /** Alias for ISO2 country code. */
  export type CountryName = PhoneFieldCountryName;
  /** BCP 47 locale for country names and sorting. */
  export type Lang = PhoneFieldLang;
  /** Emitted/controlled value: countryIso2, countryDialCode, nationalNumber, e164, isValid. */
  export type Value = PhoneFieldValue;

  /** Renders a single country in the dropdown list. */
  export type RenderCountryItem = (country: Country) => React.ReactNode;
  /** Renders the selected country in the trigger. */
  export type RenderCountryValue = (country: Country) => React.ReactNode;

  /** Class names for Country sub-parts (trigger, popup, searchInput, list, item, etc.). */
  export type CountrySlots<Value extends PhoneField.Country = PhoneField.Country> = {
    root?: Combobox.Root.Props<Value>;
    placeholder?: React.HTMLAttributes<HTMLSpanElement>;
    trigger?: Combobox.Trigger.Props;
    value?: Combobox.Value.Props;
    icon?: Combobox.Icon.Props;
    popup?: Combobox.Popup.Props;
    positioner?: Combobox.Positioner.Props;
    searchInput?: Combobox.Input.Props;
    list?: Combobox.List.Props;
    item?: Combobox.Item.Props;
    empty?: Combobox.Empty.Props;
  };

  /**
   * Props for `PhoneField.Root`. Extends div. Use `value`/`onValueChange` for controlled mode,
   * or `defaultValue`/`defaultCountry` for uncontrolled. Set `name` to serialize value into FormData.
   */
  export type RootProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "defaultValue"
  > & {
    value?: Value;
    defaultValue?: Value;
    onValueChange?: (value: Value) => void;
    defaultCountry?: CountryCodeValue;
    countries?: readonly CountryCodeValue[];
    lang?: Lang;
    name?: string;
    formatOnType?: boolean;
  };

  /** Props for `PhoneField.Country`: label, placeholders, icon, and `slots` for styling. */
  export type CountryProps = {
    placeholder?: React.ReactNode;
    noResultsText?: React.ReactNode;
    inputPlaceholder?: string;
    icon?: React.ReactNode;
    slots?: CountrySlots;
    renderCountryItem?: RenderCountryItem;
    renderCountryValue?: RenderCountryValue;
  };

  /** Props for `PhoneField.Input`. Extends Base UI Input (className, onValueChange, etc.). */
  export type InputProps = BaseInput.Props;
}
