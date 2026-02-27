import { Field } from "@base-ui/react/field";
import { PhoneField } from "phonefield";
import { PhoneFieldUtils } from "phonefield/utils";
import * as React from "react";
import { FormatRow } from "@/components/format-row";

const liveCountrySlots: PhoneField.CountrySlots = {
  root: "shrink-0",
  trigger:
    "inline-flex bg-[canvas] h-10 items-center justify-between gap-2 rounded-xl border border-gray-200 pr-2.5 pl-3 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-[popup-open]:bg-gray-100 cursor-default whitespace-nowrap",
  value: "whitespace-nowrap",
  icon: "flex",
  popup:
    "[--input-container-height:3rem] origin-[var(--transform-origin)] min-w-[16rem] max-w-[var(--available-width)] max-h-[24rem] rounded-xl bg-[canvas] shadow-lg shadow-gray-200 text-gray-900 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
  searchInput:
    "m-2 h-10 w-[calc(100%-1rem)] font-normal rounded-lg border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800",
  empty: "p-4 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0",
  list: "overflow-y-auto scroll-py-2 py-2 overscroll-contain max-h-[min(calc(24rem-var(--input-container-height)),calc(var(--available-height)-var(--input-container-height)))] empty:p-0",
  item: "grid min-w-[max(16rem,var(--anchor-width))] cursor-default grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2.5 pr-4 pl-4 text-base leading-5 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-lg data-[highlighted]:before:bg-gray-900",
};

export function LivePlayground() {
  const [value, setValue] = React.useState<PhoneField.Value>({
    countryIso2: "US",
    countryDialCode: "1",
    nationalNumber: "",
    e164: null,
    isValid: false,
  });
  const [phoneTouched, setPhoneTouched] = React.useState(false);

  const parsed = PhoneFieldUtils.parse(value);
  const hasNumber = value.nationalNumber.trim().length > 0;
  const requiredError = phoneTouched && !hasNumber;
  const invalidError = phoneTouched && hasNumber && !value.isValid;
  const showPhoneError = requiredError || invalidError;
  const phoneErrorText = requiredError
    ? "Phone is required"
    : "Invalid phone number";

  const formatPreview = [
    { label: "National", value: parsed?.formatNational() ?? "-" },
    { label: "International", value: parsed?.formatInternational() ?? "-" },
    { label: "E.164", value: value.e164 ?? "-" },
    { label: "RFC3966 URI", value: parsed?.getURI() ?? "-" },
    {
      label: "Meta",
      value: `${parsed?.country ?? "-"} | +${parsed?.countryCallingCode ?? "-"}`,
    },
  ] as const;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 md:p-8">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-700">
        <span className="size-1.5 rounded-full bg-sky-500" />
        Live
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
        Playground
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Base UI–like motion and popup behavior using the PhoneField primitive API.
      </p>

      <div className="mt-6">
        <Field.Root
          touched={phoneTouched}
          dirty={phoneTouched && hasNumber}
          invalid={showPhoneError}
          className="space-y-2"
        >
          <Field.Label className="text-sm font-medium text-slate-700">
            Phone number
          </Field.Label>

          <PhoneField.Root
            value={value}
            onValueChange={setValue}
            className="space-y-0"
            renderCountryValue={(country) =>
              `${country.flag ?? ""} ${country.dialCode}`
            }
            renderCountryItem={(country) => (
              <>
                <span className="truncate">
                  {country.flag ? `${country.flag} ` : ""}
                  {country.name}
                </span>
                <span className="text-xs opacity-70">
                  {country.dialCode}
                </span>
              </>
            )}
          >
            <div className="flex items-center gap-2">
              <PhoneField.Country
                inputPlaceholder="e.g. United Kingdom"
                slots={liveCountrySlots}
              />
              <div className="min-w-0 flex-1">
                <PhoneField.Input
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-base text-gray-900 outline-none focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 data-invalid:border-red-500 data-valid:border-emerald-500"
                  onBlur={() => setPhoneTouched(true)}
                  onValueChange={() => setPhoneTouched(true)}
                />
              </div>
            </div>
          </PhoneField.Root>

          <Field.Error
            match={showPhoneError}
            className="text-sm text-red-600"
          >
            {phoneErrorText}
          </Field.Error>
          <p className="text-xs text-slate-500">
            Input states are exposed via <code>data-valid</code> and{" "}
            <code>data-invalid</code>.
          </p>
        </Field.Root>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Number format lens
        </h3>
        <p className="mt-1 text-xs text-slate-600">
          Real-time output from <code>PhoneFieldUtils.parse</code> and{" "}
          <code>PhoneFieldUtils.isValid</code>.
        </p>
        <div className="mt-3 space-y-2">
          {formatPreview.map((row) => (
            <FormatRow
              key={row.label}
              label={row.label}
              value={row.value}
            />
          ))}
          <FormatRow
            label="Validity"
            value={`${PhoneFieldUtils.isValid(value)} (value) | ${PhoneFieldUtils.isValid(
              value.e164 ?? "",
            )} (raw)`}
          />
        </div>
      </div>
    </article>
  );
}
