import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDocumentationScrollSpy } from "./use-documentation-scroll-spy";

type ObserverCallback = ConstructorParameters<typeof IntersectionObserver>[0];

let observerCallback: ObserverCallback;
let observedElements: Element[];
let disconnect: ReturnType<typeof vi.fn>;

class IntersectionObserverMock {
	readonly root = null;
	readonly rootMargin: string;
	readonly thresholds: readonly number[];

	constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
		observerCallback = callback;
		this.rootMargin = options?.rootMargin ?? "0px";
		this.thresholds = [Number(options?.threshold ?? 0)];
	}

	disconnect = disconnect;
	observe = (element: Element) => observedElements.push(element);
	takeRecords = () => [];
	unobserve = vi.fn();
}

function entry(target: Element, isIntersecting: boolean) {
	return { isIntersecting, target } as IntersectionObserverEntry;
}

function notify(entries: IntersectionObserverEntry[]) {
	observerCallback(entries, {} as IntersectionObserver);
}

describe("useDocumentationScrollSpy", () => {
	beforeEach(() => {
		observedElements = [];
		disconnect = vi.fn();
		vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
		document.body.innerHTML = `
			<section id="doc-getting-started" data-doc-anchor="getting-started"></section>
			<section id="doc-styling" data-doc-anchor="styling"></section>
		`;
		window.history.replaceState({}, "", "/");
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("tracks the first visible section and replaces the URL without scrolling", () => {
		const scrollTo = vi.fn();
		vi.stubGlobal("scrollTo", scrollTo);
		const nativeReplaceState = window.history.replaceState.bind(window.history);
		let targetExistedWhileReplacing = true;
		vi.spyOn(window.history, "replaceState").mockImplementation(
			(state, unused, url) => {
				targetExistedWhileReplacing = Boolean(
					document.getElementById("styling"),
				);
				nativeReplaceState(state, unused, url);
			},
		);
		const { result, unmount } = renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const styling = document.querySelector('[data-doc-anchor="styling"]');
		if (!styling) throw new Error("Expected the styling section");

		expect(observedElements.map((element) => element.id)).toEqual([
			"doc-getting-started",
			"doc-styling",
		]);

		act(() => notify([entry(styling, true)]));

		expect(result.current.currentHash).toBe("styling");
		expect(window.location.hash).toBe("#styling");
		expect(scrollTo).not.toHaveBeenCalled();
		expect(targetExistedWhileReplacing).toBe(false);
		expect(document.querySelector('[data-doc-anchor="styling"]')).toBe(styling);

		unmount();
		expect(disconnect).toHaveBeenCalledOnce();
	});

	it("keeps the clicked anchor highlighted while intermediate sections pass", () => {
		const { result } = renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const gettingStarted = document.querySelector(
			'[data-doc-anchor="getting-started"]',
		);
		const styling = document.querySelector('[data-doc-anchor="styling"]');
		if (!(gettingStarted && styling)) {
			throw new Error("Expected both documentation sections");
		}

		act(() => result.current.beginHashNavigation("styling"));
		act(() => notify([entry(gettingStarted, true)]));

		expect(result.current.currentHash).toBe("styling");

		act(() => notify([entry(gettingStarted, false), entry(styling, true)]));
		expect(result.current.currentHash).toBe("styling");
	});

	it("preserves the active section while mobile navigation locks page scroll", () => {
		const { result } = renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const gettingStarted = document.querySelector(
			'[data-doc-anchor="getting-started"]',
		);
		const styling = document.querySelector('[data-doc-anchor="styling"]');
		if (!(gettingStarted && styling)) {
			throw new Error("Expected both documentation sections");
		}

		act(() => notify([entry(styling, true)]));
		expect(result.current.currentHash).toBe("styling");

		act(() => result.current.pauseScrollSpy());
		act(() => notify([entry(styling, false), entry(gettingStarted, true)]));

		expect(result.current.currentHash).toBe("styling");
		expect(window.location.hash).toBe("#styling");
	});

	it("ignores page-level fragments that are outside the documentation index", () => {
		window.history.replaceState({}, "", "/#docs");
		const { result } = renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const gettingStarted = document.querySelector(
			'[data-doc-anchor="getting-started"]',
		);
		if (!gettingStarted)
			throw new Error("Expected the getting started section");

		expect(result.current.currentHash).toBe("");
		act(() => notify([entry(gettingStarted, true)]));

		expect(result.current.currentHash).toBe("getting-started");
		expect(window.location.hash).toBe("#getting-started");
	});
});
