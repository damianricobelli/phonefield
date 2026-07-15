import { useCallback, useEffect, useRef, useState } from "react";

const SECTION_SEPARATOR = "\u0000";

/** Keeps the URL fragment and the documentation section near the viewport top in sync. */
export function useDocumentationScrollSpy(sectionIds: readonly string[]) {
	const [currentHash, setCurrentHash] = useState("");
	const currentHashRef = useRef("");
	const navigatingHashRef = useRef<string | null>(null);
	const sectionIdKey = sectionIds.join(SECTION_SEPARATOR);

	useEffect(() => {
		const knownIds = new Set(
			sectionIdKey.split(SECTION_SEPARATOR).filter(Boolean),
		);
		const syncHash = () => {
			const hash = window.location.hash.replace(/^#/, "");
			const nextHash = knownIds.has(hash) ? hash : "";
			currentHashRef.current = nextHash;
			navigatingHashRef.current = nextHash || null;
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

				const navigationTarget = navigatingHashRef.current;
				if (navigationTarget) {
					if (visibleIds.has(navigationTarget)) {
						navigatingHashRef.current = null;
					}
					return;
				}

				const activeId = orderedIds.find((id) => visibleIds.has(id));
				if (!activeId || activeId === currentHashRef.current) return;

				currentHashRef.current = activeId;
				setCurrentHash(activeId);

				const url = new URL(window.location.href);
				url.hash = activeId;
				window.history.replaceState(window.history.state, "", url);
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

	const beginHashNavigation = useCallback((hash: string) => {
		navigatingHashRef.current = hash;
		currentHashRef.current = hash;
		setCurrentHash(hash);
	}, []);

	return { currentHash, beginHashNavigation };
}
