export const quickStartSnippet = `import { PhoneField } from "phonefield";

export function SignupPhone() {
  return (
    <PhoneField.Root defaultCountry="US" lang="en">
      <PhoneField.Country />
      <PhoneField.Input />
    </PhoneField.Root>
  );
}`;

export const controlledSnippet = `import * as React from "react";
import { PhoneField } from "phonefield";

export function CheckoutPhone() {
  const [phone, setPhone] = React.useState<PhoneField.Value>({
    countryIso2: "US",
    countryDialCode: "1",
    nationalNumber: "",
    e164: null,
    isValid: false,
  });

  return (
    <PhoneField.Root value={phone} onValueChange={setPhone}>
      <PhoneField.Country />
      <PhoneField.Input />
    </PhoneField.Root>
  );
}`;

export const formDataSnippet = `import { PhoneField } from "phonefield";
import { PhoneFieldUtils } from "phonefield/utils";

// Uncontrolled is the default: omit \`value\` and \`onValueChange\`.
<form
  onSubmit={(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = PhoneFieldUtils.fromFormData(formData, "phone");
    // phone -> PhoneField.Value | null
  }}
>
  <PhoneField.Root name="phone" defaultCountry="US">
    <PhoneField.Country />
    <PhoneField.Input />
  </PhoneField.Root>
</form>

// Server side:
const formData = await request.formData();
const phone = PhoneFieldUtils.fromFormData(formData, "phone");`;

export const subsetSnippet = `<PhoneField.Root countries={["US", "CA", "MX"]}>
  <PhoneField.Country />
  <PhoneField.Input />
</PhoneField.Root>
`;

export const partsSnippet = `const countrySlots: PhoneField.CountrySlots = {
  trigger: "h-10 rounded-md border border-gray-200 px-3",
  popup: "rounded-lg shadow-lg",
  item:
    "px-3 py-2 data-[highlighted]:bg-slate-900 data-[highlighted]:text-white",
};

<PhoneField.Root className="flex items-center gap-2">
  <PhoneField.Country slots={countrySlots} />
  <PhoneField.Input className="h-10 rounded-md border border-gray-200 px-3" />
</PhoneField.Root>`;

export const validitySnippet = `import { Field } from "@base-ui/react/field";

const hasNumber = value.nationalNumber.trim().length > 0;
const showError = hasNumber && !value.isValid;

<Field.Root invalid={showError} className="space-y-2">
  <Field.Label>Phone</Field.Label>

  <PhoneField.Root value={value} onValueChange={setValue}>
    <PhoneField.Country />
    <PhoneField.Input className="data-invalid:border-red-500 data-valid:border-emerald-500" />
  </PhoneField.Root>

  <Field.Error match={showError}>Invalid phone number</Field.Error>
</Field.Root>`;

export const formatAndUtilsSnippet = `import { PhoneFieldUtils } from "phonefield/utils";

// parse() returns libphonenumber PhoneNumber: formatNational(), formatInternational(), getURI()
const parsed = PhoneFieldUtils.parse(value);

const output = {
  isValid: PhoneFieldUtils.isValid(value),
  e164: value.e164,
  national: parsed?.formatNational(),
  international: parsed?.formatInternational(),
};

// Frontend or backend:
PhoneFieldUtils.isValid("+14155552671");
PhoneFieldUtils.fromFormData(formData, "phone");
PhoneFieldUtils.getCountries("es-AR"); // Map<iso2, country> (locale for names)
PhoneFieldUtils.countries; // default map (en)`;
