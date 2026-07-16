import { useEffect, useState } from "react";

const SECTION_SEPARATOR = "\u0000";

/** Highlights the section near the viewport top without mutating the URL while scrolling. */
export function useDocumentationScrollSpy(sectionIds: readonly string[]) {
	const [currentHash, setCurrentHash] = useState("");
	const sectionIdKey = sectionIds.join(SECTION_SEPARATOR);

	useEffect(() => {
		const knownIds = new Set(
			sectionIdKey.split(SECTION_SEPARATOR).filter(Boolean),
		);
		const syncHash = () => {
			const hash = window.location.hash.replace(/^#/, "");
			const nextHash = knownIds.has(hash) ? hash : "";
			setCurrentHash(nextHash);
		};

		syncHash();
		window.addEventListener("hashchange", syncHash);
		return () => window.removeEventListener("hashchange", syncHash);
	}, [sectionIdKey]);

	useEffect(() => {
		if (!("IntersectionObserver" in window)) return;

		const orderedIds = sectionIdKey.split(SECTION_SEPARATOR).filter(Boolean);
		const visibleIds = new Set<string>();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visibleIds.add(entry.target.id);
					} else {
						visibleIds.delete(entry.target.id);
					}
				}

				const activeId = orderedIds.find((id) => visibleIds.has(id));
				if (activeId) setCurrentHash(activeId);
			},
			{
				rootMargin: "-96px 0px -55% 0px",
				threshold: 0,
			},
		);

		for (const id of orderedIds) {
			const section = document.getElementById(id);
			if (section) observer.observe(section);
		}

		return () => observer.disconnect();
	}, [sectionIdKey]);

	return { currentHash };
}
