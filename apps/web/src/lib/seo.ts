export const SITE_URL = "https://phonefield.vercel.app";
export const SITE_NAME = "PhoneField";
export const REPOSITORY_URL = "https://github.com/damianricobelli/phonefield";

export const OG_IMAGE = {
	url: `${SITE_URL}/opengraph.png`,
	width: 1200,
	height: 630,
	alt: "PhoneField v2: the composable React phone input for your design system",
} as const;

export function absoluteUrl(path = "/") {
	return new URL(path, SITE_URL).toString();
}

type PageSeo = {
	/** 50–60 characters reads best in search results. */
	title: string;
	/** 120–160 characters reads best in search results. */
	description: string;
	path: string;
};

/**
 * Per-page tags. TanStack Router keeps the deepest route's `meta` for each
 * name/property, so pages override the site defaults from the root route.
 * Links are not deduplicated, so the canonical lives only on pages.
 */
export function pageSeo({ title, description, path }: PageSeo) {
	const url = absoluteUrl(path);
	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ name: "robots", content: "index, follow, max-image-preview:large" },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:url", content: url },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: description },
			{ name: "twitter:url", content: url },
		],
		links: [{ rel: "canonical", href: url }],
	};
}

/**
 * Site-wide tags, rendered on every page including 404s. Titles,
 * descriptions, robots, and canonicals belong to pages (see pageSeo).
 */
export const siteMeta = [
	{ charSet: "utf-8" },
	{ name: "viewport", content: "width=device-width, initial-scale=1" },
	{ name: "application-name", content: SITE_NAME },
	{ name: "apple-mobile-web-app-title", content: SITE_NAME },
	{ name: "author", content: "damianricobelli" },
	{ name: "theme-color", content: "#f8fafc" },
	{ name: "color-scheme", content: "light" },
	// Example numbers on the page should not become tap-to-call links on iOS.
	{ name: "format-detection", content: "telephone=no" },
	{ property: "og:site_name", content: SITE_NAME },
	{ property: "og:type", content: "website" },
	{ property: "og:locale", content: "en_US" },
	{ property: "og:image", content: OG_IMAGE.url },
	{ property: "og:image:secure_url", content: OG_IMAGE.url },
	{ property: "og:image:type", content: "image/png" },
	{ property: "og:image:width", content: String(OG_IMAGE.width) },
	{ property: "og:image:height", content: String(OG_IMAGE.height) },
	{ property: "og:image:alt", content: OG_IMAGE.alt },
	{ name: "twitter:card", content: "summary_large_image" },
	{ name: "twitter:image", content: OG_IMAGE.url },
	{ name: "twitter:image:alt", content: OG_IMAGE.alt },
];

export const siteLinks = [
	{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
	{ rel: "icon", href: "/logo192.png", type: "image/png", sizes: "192x192" },
	{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
	{ rel: "manifest", href: "/manifest.json" },
];

/** Structured data for the home page. */
export const softwareJsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			"@id": `${SITE_URL}/#website`,
			url: absoluteUrl("/"),
			name: SITE_NAME,
			description:
				"Documentation, recipes, and a live playground for the PhoneField React component.",
			inLanguage: "en",
		},
		{
			"@type": "SoftwareSourceCode",
			"@id": `${SITE_URL}/#software`,
			name: SITE_NAME,
			description:
				"Accessible, composable React phone input primitives built on Base UI and libphonenumber-js.",
			url: absoluteUrl("/"),
			codeRepository: REPOSITORY_URL,
			programmingLanguage: ["TypeScript", "React"],
			runtimePlatform: "React 19",
			license: "https://opensource.org/licenses/MIT",
			version: "2.0.0",
			image: OG_IMAGE.url,
			author: {
				"@type": "Person",
				name: "damianricobelli",
				url: "https://github.com/damianricobelli",
			},
			isPartOf: { "@id": `${SITE_URL}/#website` },
		},
	],
};
