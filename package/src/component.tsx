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
  fromFormData as fromPhoneFieldFormData,
  getCountriesMap,
  getDefaultCountriesMap,
  isValidPhoneField,
  parsePhoneField,
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

function Root({
  value,
  defaultValue,
  onValueChange,
  defaultCountry,
  countries,
  lang,
  name,
  formatOnType = true,
  renderCountryItem,
  renderCountryValue,
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
    renderCountryItem,
    renderCountryValue,
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

function Country({
  label,
  placeholder = "Select country",
  noResultsText = "No countries found",
  inputPlaceholder = "Search country",
  icon,
  slots,
}: PhoneField.CountryProps) {
  const {
    selectedCountry,
    availableCountries,
    setCountry,
    renderCountryItem,
    renderCountryValue,
  } = usePhoneFieldContext();
  const styles = slots ?? {};

  const selectedInList =
    availableCountries.find(
      (country) => country.iso2 === selectedCountry.iso2,
    ) ?? availableCountries[0];

  return (
    <div className={styles.root}>
      {label ? <div className={styles.label}>{label}</div> : null}

      <Combobox.Root
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
        <Combobox.Trigger className={styles.trigger}>
          <span className={styles.value}>
            <Combobox.Value
              placeholder={
                <span className={styles.placeholder}>{placeholder}</span>
              }
            >
              {(country: PhoneField.Country | null) => {
                if (!country) {
                  return placeholder;
                }

                return (
                  renderCountryValue?.(country) ??
                  `${country.flag ? `${country.flag} ` : ""}${country.name} (${country.dialCode})`
                );
              }}
            </Combobox.Value>
          </span>
          <Combobox.Icon className={styles.icon}>
            {icon ?? <ChevronUpDownIcon />}
          </Combobox.Icon>
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner align="start" sideOffset={4}>
            <Combobox.Popup className={styles.popup}>
              <Combobox.Input
                className={styles.searchInput}
                placeholder={inputPlaceholder}
                aria-label={inputPlaceholder}
              />
              <Combobox.Empty className={styles.empty}>
                {noResultsText}
              </Combobox.Empty>
              <Combobox.List className={styles.list}>
                {(country: PhoneField.Country) => (
                  <Combobox.Item
                    key={country.iso2}
                    value={country}
                    className={styles.item}
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
    </div>
  );
}

const Input = ({
  className,
  onValueChange,
  ...props
}: PhoneField.InputProps) => {
  const { value, setNumber } = usePhoneFieldContext();
  const baseInputClassName =
    "h-10 rounded-md border border-zinc-300 px-3 flex-1 outline-none focus:border-zinc-500";
  const resolvedClassName: BaseInput.Props["className"] =
    typeof className === "function"
      ? (state) => cn(baseInputClassName, className(state))
      : cn(baseInputClassName, className);

  return (
    <BaseInput
      {...props}
      inputMode="tel"
      className={resolvedClassName}
      value={value.nationalNumber}
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
  Input,
  parse: parsePhoneField,
  isValid: isValidPhoneField,
  fromFormData: fromPhoneFieldFormData,
  getCountries: getCountriesMap,
  get countries() {
    return getDefaultCountriesMap();
  },
};

export namespace PhoneField {
  export type Country = PhoneFieldCountry;
  export type CountryMap = PhoneFieldCountryMap;
  export type CountryCodeValue = PhoneFieldCountryCodeValue;
  export type CountryName = PhoneFieldCountryName;
  export type Lang = PhoneFieldLang;
  export type Value = PhoneFieldValue;

  export type RenderCountryItem = (country: Country) => React.ReactNode;
  export type RenderCountryValue = (country: Country) => React.ReactNode;

  export type CountrySlots = {
    root?: string;
    label?: string;
    placeholder?: string;
    trigger?: string;
    value?: string;
    icon?: string;
    popup?: string;
    searchInput?: string;
    list?: string;
    item?: string;
    empty?: string;
  };

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
    renderCountryItem?: RenderCountryItem;
    renderCountryValue?: RenderCountryValue;
  };

  export type CountryProps = {
    label?: React.ReactNode;
    placeholder?: React.ReactNode;
    noResultsText?: React.ReactNode;
    inputPlaceholder?: string;
    icon?: React.ReactNode;
    slots?: CountrySlots;
  };

  export type InputProps = BaseInput.Props;
}
