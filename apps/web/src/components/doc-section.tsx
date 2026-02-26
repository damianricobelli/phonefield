import { InstallTabs } from "@/components/install-tabs";
import { DocBlock } from "@/components/doc-block";
import {
  quickStartSnippet,
  controlledSnippet,
  formDataSnippet,
  subsetSnippet,
  partsSnippet,
  validitySnippet,
  formatAndUtilsSnippet,
} from "@/lib/snippets";

export function DocSection() {
  return (
    <section className="relative mx-auto max-w-6xl space-y-10 px-6 pb-20">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
          Documentation
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
          Installation, usage patterns, and API reference.
        </p>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          Installation
        </h3>
        <p className="mt-1 mb-4 max-w-3xl text-sm text-slate-600 md:text-base">
          Install the package with your preferred manager and copy the command
          instantly.
        </p>
        <InstallTabs className="max-w-3xl" packageName="phonefield" />
      </article>

      <DocBlock
        title="Quick Start"
        description="Minimal setup. Root can run uncontrolled by default, gives normalized output, and Input placeholder adapts to the selected country."
        code={quickStartSnippet}
      />
      <DocBlock
        title="Controlled Mode"
        description="Use this when your form or global state owns the value and you need full control over updates."
        code={controlledSnippet}
      />
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm md:p-5">
        Use <strong>uncontrolled</strong> for simple forms. Switch to{" "}
        <strong>controlled</strong> when external state needs to orchestrate
        validation, steps, or async flows.
      </div>
      <DocBlock
        title="Uncontrolled + FormData (Client / Server)"
        description="Set Root name to serialize the full PhoneField.Value as JSON in a hidden input. Then read it from FormData in client or server."
        code={formDataSnippet}
      />
      <DocBlock
        title="Country Subset (Type-safe IntelliSense)"
        description="Limit the available countries from Root using ISO codes."
        code={subsetSnippet}
      />
      <DocBlock
        title="Styling With Country Slots"
        description="Country styling lives in PhoneField.Country via slots, while Root and Input keep standard className styling."
        code={partsSnippet}
      />
      <DocBlock
        title="Validity States (data-valid / data-invalid)"
        description="Pair PhoneField with Base UI Field to show invalid states on the input and render clear error messages."
        code={validitySnippet}
      />
      <DocBlock
        title="Formatting + Utils"
        description="Validate and format consistently in frontend or backend. parse() returns libphonenumber's PhoneNumber (formatNational, formatInternational, getURI). isValid and parse accept Value or E.164 string; optional { defaultCountry } for national-number strings."
        code={formatAndUtilsSnippet}
      />

      <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          PhoneFieldUtils API
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Reference for <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">phonefield/utils</code>. Use the same helpers on client and server.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 pr-4 text-left font-semibold text-slate-700">
                  Method / property
                </th>
                <th className="pb-3 text-left font-semibold text-slate-700">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-800">
                  parse(value, options?)
                </td>
                <td className="py-2.5">
                  Parse <code>Value</code> or E.164 string → libphonenumber{" "}
                  <code>PhoneNumber</code> (formatNational, formatInternational, getURI).{" "}
                  <code>options.defaultCountry</code> for national numbers.
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-800">
                  isValid(value, options?)
                </td>
                <td className="py-2.5">
                  Validate <code>Value</code> or raw string. Same options as parse.
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-800">
                  fromFormData(formData, name)
                </td>
                <td className="py-2.5">
                  Read serialized <code>PhoneField.Value</code> from FormData → Value | null.
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-800">
                  getCountries(locale?)
                </td>
                <td className="py-2.5">
                  Map of ISO2 → country (name, dialCode, flag). Locale for display names.
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-800">
                  countries
                </td>
                <td className="py-2.5">
                  Default countries map (en). Getter, no locale argument.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
