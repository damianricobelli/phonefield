import { PhoneField } from "phonefield";
import { getExampleNumber } from "phonefield/utils";

// lang localizes country names, sorting, search, and the trigger label.
// labels translates the picker's search placeholder and empty text.
export function ArgentinaPhone() {
	return (
		<PhoneField.Root lang="es-AR" defaultCountry="AR">
			<PhoneField.Label>Teléfono</PhoneField.Label>
			<PhoneField.Country
				labels={{ search: "Buscar país", empty: "Sin resultados" }}
			/>
			<PhoneField.Input
				placeholder={(country) => getExampleNumber(country.iso2)}
			/>
			<PhoneField.Error>
				{(state) =>
					state.filled ? "Ingresá un número válido." : "Ingresá un número."
				}
			</PhoneField.Error>
		</PhoneField.Root>
	);
}
