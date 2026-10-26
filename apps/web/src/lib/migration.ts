export type MigrationStep = {
	title: string;
	description: string;
	before: string;
	after: string;
	/** Behavior changes compile without errors, so they are flagged. */
	behaviorChange?: boolean;
};

export const migrationComparisons = [
	{
		title: "Style each part with className",
		description:
			"Country no longer takes classNames. Compose the parts you want to style and pass className to each one. Zero-config <PhoneField.Country /> still renders the full picker.",
		before: `<PhoneField.Country
  classNames={{
    trigger: "trigger",
    popup: "popup",
    item: "item",
  }}
/>`,
		after: `<PhoneField.Country>
  <PhoneField.CountryTrigger className="trigger" />
  <PhoneField.CountryPortal>
    <PhoneField.CountryPositioner>
      <PhoneField.CountryPopup className="popup">
        <PhoneField.CountrySearch />
        <PhoneField.CountryEmpty />
        <PhoneField.CountryList>
          {(country) => (
            <PhoneField.CountryItem country={country} className="item" />
          )}
        </PhoneField.CountryList>
      </PhoneField.CountryPopup>
    </PhoneField.CountryPositioner>
  </PhoneField.CountryPortal>
</PhoneField.Country>`,
	},
	{
		title: "Move positioning to CountryPositioner",
		description:
			'Every Base UI Positioner prop is available. Defaults are unchanged: side="bottom", align="start", sideOffset={4}.',
		before: `<PhoneField.Country
  positioning={{ side: "top", sideOffset: 8 }}
/>`,
		after: `<PhoneField.CountryPositioner side="top" sideOffset={8}>
  <PhoneField.CountryPopup>…</PhoneField.CountryPopup>
</PhoneField.CountryPositioner>`,
	},
	{
		title: "Replace renderers and icon with children",
		description:
			"CountryValue and CountryList take a function of the country. List keys are handled for you. icon becomes the children of CountryIcon.",
		before: `<PhoneField.Country
  icon={<ChevronDown />}
  renderCountryValue={(c) => c.dialCode}
  renderCountryItem={(c) => c.name}
/>`,
		after: `<PhoneField.CountryTrigger>
  <PhoneField.CountryValue>{(c) => c.dialCode}</PhoneField.CountryValue>
  <PhoneField.CountryIcon><ChevronDown /></PhoneField.CountryIcon>
</PhoneField.CountryTrigger>
…
<PhoneField.CountryList>
  {(c) => <PhoneField.CountryItem country={c}>{c.name}</PhoneField.CountryItem>}
</PhoneField.CountryList>`,
	},
	{
		title: "Pass slotProps to the part itself",
		description:
			"slotProps.root becomes props on Country (open, onOpenChange, modal…). Every other slot becomes props on its part.",
		before: `<PhoneField.Country
  slotProps={{
    root: { modal: true, onOpenChange },
    trigger: { "aria-label": "Country" },
  }}
/>`,
		after: `<PhoneField.Country modal onOpenChange={onOpenChange}>
  <PhoneField.CountryTrigger aria-label="Country" />
  …
</PhoneField.Country>`,
	},
	{
		title: "Move copy props to labels",
		description:
			"inputPlaceholder and noResultsText become Country labels, which also apply to composed parts. Props on CountrySearch and CountryEmpty still win. placeholder is removed: a country is always selected.",
		before: `<PhoneField.Country
  inputPlaceholder="Buscar país"
  noResultsText="Sin resultados"
/>`,
		after: `<PhoneField.Country
  labels={{ search: "Buscar país", empty: "Sin resultados" }}
/>`,
	},
	{
		title: "Replace manual validation wiring with Group and Error",
		description:
			"Root tracks touched, focus, and validity; submitting the form reveals errors and reset restores the value. Group is the styled shell with data-invalid, Error renders only while invalid, and both Description and Error are linked with aria-describedby.",
		before: `const [touched, setTouched] = useState(false);
const invalid = touched && !phone.isValid;

<label htmlFor="phone">Phone</label>
<PhoneField.Root className={invalid ? "error" : ""}>
  <PhoneField.Country />
  <PhoneField.Input
    id="phone"
    aria-invalid={invalid || undefined}
    aria-describedby="phone-error"
    onBlur={() => setTouched(true)}
  />
</PhoneField.Root>
{invalid && <p id="phone-error">Invalid number</p>}`,
		after: `<PhoneField.Root required invalid={!!serverError}>
  <PhoneField.Label>Phone</PhoneField.Label>
  <PhoneField.Group className="data-invalid:border-red-500">
    <PhoneField.Country />
    <PhoneField.Input />
  </PhoneField.Group>
  <PhoneField.Error>{serverError}</PhoneField.Error>
</PhoneField.Root>`,
	},
	{
		title: "onValueChange receives change details",
		description:
			"A second argument reports why the value changed. Existing one-argument callbacks keep working.",
		before: `onValueChange={(value) => save(value)}`,
		after: `onValueChange={(value, { reason }) => {
  // "input" | "paste" | "country" | "undo" | "redo"
  if (reason !== "country") save(value);
}}`,
	},
	{
		title: "Digits beyond the maximum length are blocked",
		description:
			"limitMaxLength now defaults to true: typing or pasting more digits than any number in the country can have is ignored. Opt out to keep v1 behavior.",
		before: `<PhoneField.Root>`,
		after: `<PhoneField.Root limitMaxLength={false}>`,
		behaviorChange: true,
	},
	{
		title: "The trigger shows flag and dial code",
		description:
			'The default trigger content is now "🇺🇸 +1" instead of "🇺🇸 United States (+1)". Its accessible name stays "United States (+1)", so role queries keep working; text queries do not.',
		before: `screen.getByText("🇺🇸 United States (+1)");`,
		after: `screen.getByRole("combobox", { name: "United States (+1)" });
// or restore the old content:
<PhoneField.CountryValue>
  {(c) => \`\${c.flag} \${c.name} (\${c.dialCode})\`}
</PhoneField.CountryValue>`,
		behaviorChange: true,
	},
] as const satisfies readonly MigrationStep[];

export const migrationChecklist = [
	"@base-ui/react is 1.9 or newer",
	"No classNames, slotProps, positioning, or render* props on Country",
	"No PhoneField.CountryClassNames, CountrySlotProps, or Render* types",
	"CSS targets phone-field-country-search, not the old search slots",
	"Manual touched, aria-invalid, and error wiring replaced by Group and Error",
	"limitMaxLength={false} added where long input must be kept",
	"Tests no longer match the trigger by country name text",
] as const;
