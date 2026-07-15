import { PhoneField } from "phonefield";

export function ArgentinaPhone() {
	return (
		<PhoneField.Root lang="es-AR" defaultCountry="AR">
			<PhoneField.Country
				inputPlaceholder="Buscar país"
				noResultsText="No se encontraron países"
			/>
			<PhoneField.Input aria-label="Número de teléfono" />
		</PhoneField.Root>
	);
}
