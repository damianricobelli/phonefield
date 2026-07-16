import { useCallback, useEffect, useRef, useState } from "react";

const SECTION_SEPARATOR = "\u0000";

function replaceVisibleHash(hash: string) {
	const url = new URL(window.location.href);
	url.hash = hash;
	window.history.replaceState(window.history.state, "", url);
}

function findDocumentationAnchor(hash: string) {
	return Array.from(
		document.querySelectorAll<HTMLElement>("[data-doc-anchor]"),
	).find((element) => element.dataset.docAnchor === hash);
}

/** Syncs the active hash without exposing a native anchor that can snap scroll. */
export function useDocumentationScrollSpy(
	sectionIds: readonly string[],
	paused = false,
) {
	const [currentHash, setCurrentHash] = useState("");
	const currentHashRef = useRef("");
	const navigatingHashRef = useRef<string | null>(null);
	const pausedRef = useRef(paused);
	const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const sectionIdKey = sectionIds.join(SECTION_SEPARATOR);
	pausedRef.current = paused;
	const pauseScrollSpy = useCallback(() => {
		pausedRef.current = true;
	}, []);

	const beginHashNavigation = useCallback(
		(hash: string, behavior: ScrollBehavior = "smooth") => {
			if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
			navigatingHashRef.current = hash;
			currentHashRef.current = hash;
			setCurrentHash(hash);
			findDocumentationAnchor(hash)?.scrollIntoView?.({
				behavior,
				block: "start",
			});
			unlockTimerRef.current = setTimeout(() => {
				navigatingHashRef.current = null;
			}, 1500);
		},
		[],
	);

	useEffect(() => {
		const knownIds = new Set(
			sectionIdKey.split(SECTION_SEPARATOR).filter(Boolean),
		);
		const syncHash = (behavior: ScrollBehavior) => {
			const hash = window.location.hash.replace(/^#/, "");
			const nextHash = knownIds.has(hash) ? hash : "";
			if (nextHash) {
				beginHashNavigation(nextHash, behavior);
			} else {
				currentHashRef.current = "";
				setCurrentHash("");
			}
		};

		syncHash("auto");
		const handleHashChange = () => syncHash("smooth");
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [beginHashNavigation, sectionIdKey]);

	useEffect(() => {
		const cancelNavigationLock = () => {
			navigatingHashRef.current = null;
			if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
		};

		window.addEventListener("wheel", cancelNavigationLock, { passive: true });
		window.addEventListener("touchstart", cancelNavigationLock, {
			passive: true,
		});
		return () => {
			window.removeEventListener("wheel", cancelNavigationLock);
			window.removeEventListener("touchstart", cancelNavigationLock);
			if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
		};
	}, []);

	useEffect(() => {
		if (!("IntersectionObserver" in window)) return;

		const orderedIds = sectionIdKey.split(SECTION_SEPARATOR).filter(Boolean);
		const visibleIds = new Set<string>();

		const observer = new IntersectionObserver(
			(entries) => {
				if (
					pausedRef.current ||
					document.querySelector('[role="dialog"][data-open]')
				) {
					return;
				}

				for (const entry of entries) {
					const anchor = (entry.target as HTMLElement).dataset.docAnchor;
					if (!anchor) continue;
					if (entry.isIntersecting) {
						visibleIds.add(anchor);
					} else {
						visibleIds.delete(anchor);
					}
				}

				const activeId = orderedIds.find((id) => visibleIds.has(id));
				const navigationTarget = navigatingHashRef.current;
				if (navigationTarget) {
					if (visibleIds.has(navigationTarget)) {
						navigatingHashRef.current = null;
						if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
					}
					return;
				}
				if (!activeId || activeId === currentHashRef.current) return;
				currentHashRef.current = activeId;
				setCurrentHash(activeId);
				replaceVisibleHash(activeId);
			},
			{
				rootMargin: "-96px 0px -55% 0px",
				threshold: 0,
			},
		);

		for (const id of orderedIds) {
			const section = findDocumentationAnchor(id);
			if (section) observer.observe(section);
		}

		return () => observer.disconnect();
	}, [sectionIdKey]);

	return { currentHash, beginHashNavigation, pauseScrollSpy };
}
