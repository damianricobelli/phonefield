import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { pageSeo, softwareJsonLd } from "@/lib/seo";

const seo = pageSeo({
	title: "PhoneField — Composable React phone input for Base UI",
	description:
		"Accessible React phone number input with country picker, as-you-type formatting, validation, and E.164 output. Zero config, styled with className.",
	path: "/",
});

export const Route = createFileRoute("/")({
	component: HomePage,
	head: () => ({
		...seo,
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(softwareJsonLd),
			},
		],
	}),
});
