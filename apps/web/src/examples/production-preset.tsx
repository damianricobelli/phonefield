import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { PhoneField } from "phonefield";
import type * as React from "react";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<PhoneField.RootProps, "className"> & {
	className?: string;
	label?: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: PhoneField.InputProps["placeholder"];
	inputProps?: Omit<PhoneField.InputProps, "placeholder" | "className">;
};

export function PhoneInput({
	className,
	label,
	description,
	placeholder,
	inputProps,
	children,
	...props
}: PhoneInputProps) {
	return (
		<PhoneField.Root
			{...props}
			className={cn("grid w-full gap-1.5", className)}
		>
			{label ? (
				<PhoneField.Label className="text-sm font-medium text-foreground">
					{label}
				</PhoneField.Label>
			) : null}
			<PhoneField.Group
				className={cn(
					"flex h-10 w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-[border-color,box-shadow] duration-150",
					"data-focused:border-ring data-focused:ring-3 data-focused:ring-ring/40",
					"data-invalid:border-destructive data-invalid:ring-destructive/20",
					"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				)}
			>
				<PhoneField.Country>
					<PhoneField.CountryTrigger className="group/trigger flex shrink-0 cursor-default items-center gap-1.5 border-input border-r px-3 text-sm outline-none select-none transition-colors duration-150 hover:bg-accent/60 focus-visible:bg-accent data-popup-open:bg-accent">
						<PhoneField.CountryValue>
							{(country) => (
								<>
									<span aria-hidden className="text-base leading-none">
										{country.flag}
									</span>
									<span className="tabular-nums text-muted-foreground">
										{country.dialCode}
									</span>
								</>
							)}
						</PhoneField.CountryValue>
						<PhoneField.CountryIcon className="text-muted-foreground transition-transform duration-150 ease-out group-data-popup-open/trigger:rotate-180 motion-reduce:transition-none">
							<ChevronDownIcon className="size-3.5" />
						</PhoneField.CountryIcon>
					</PhoneField.CountryTrigger>
					<PhoneField.CountryPortal>
						<PhoneField.CountryPositioner
							className="isolate z-50"
							sideOffset={6}
						>
							<PhoneField.CountryPopup className="flex max-h-[min(22rem,var(--available-height))] w-72 max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/10 transition-[transform,opacity] duration-150 ease-out data-ending-style:[transform:scale(0.97)] data-ending-style:opacity-0 data-starting-style:[transform:scale(0.97)] data-starting-style:opacity-0 motion-reduce:transition-none">
								<div className="border-b p-1.5">
									<PhoneField.CountrySearch className="h-8 w-full rounded-md bg-muted/60 px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50" />
								</div>
								<PhoneField.CountryEmpty className="px-3 py-6 text-center text-sm text-muted-foreground empty:hidden" />
								<PhoneField.CountryList className="min-h-0 flex-1 scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0 [&_[data-preferred]]:mb-1 [&_[data-preferred]]:border-b [&_[data-preferred]]:pb-1">
									{(country) => (
										<PhoneField.CountryItem
											country={country}
											className="flex cursor-default items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
										>
											<span aria-hidden className="text-base leading-none">
												{country.flag}
											</span>
											<span className="min-w-0 flex-1 truncate">
												{country.name}
											</span>
											<span className="tabular-nums text-muted-foreground">
												{country.dialCode}
											</span>
											<PhoneField.CountryItemIndicator className="text-foreground">
												<CheckIcon className="size-3.5" />
											</PhoneField.CountryItemIndicator>
										</PhoneField.CountryItem>
									)}
								</PhoneField.CountryList>
							</PhoneField.CountryPopup>
						</PhoneField.CountryPositioner>
					</PhoneField.CountryPortal>
				</PhoneField.Country>
				<PhoneField.Input
					aria-label={label ? undefined : "Phone number"}
					{...inputProps}
					placeholder={placeholder}
					className="h-full min-w-0 flex-1 bg-transparent px-3 text-base tabular-nums outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed md:text-sm"
				/>
			</PhoneField.Group>
			{description ? (
				<PhoneField.Description className="text-xs text-muted-foreground">
					{description}
				</PhoneField.Description>
			) : null}
			<PhoneField.Error className="text-xs text-destructive" />
			{children}
		</PhoneField.Root>
	);
}
