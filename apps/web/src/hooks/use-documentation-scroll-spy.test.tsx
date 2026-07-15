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
			<section id="getting-started"></section>
			<section id="styling"></section>
		`;
		window.history.replaceState({}, "", "/");
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("tracks the first visible section and replaces the URL fragment", () => {
		const { result, unmount } = renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const styling = document.getElementById("styling");
		if (!styling) throw new Error("Expected the styling section");

		expect(observedElements.map((element) => element.id)).toEqual([
			"getting-started",
			"styling",
		]);

		act(() => notify([entry(styling, true)]));

		expect(result.current.currentHash).toBe("styling");
		expect(window.location.hash).toBe("#styling");

		unmount();
		expect(disconnect).toHaveBeenCalledOnce();
	});

	it("preserves the scroll position when the active fragment changes", () => {
		vi.stubGlobal("scrollX", 24);
		vi.stubGlobal("scrollY", 640);
		const scrollTo = vi.fn((x: number, y: number) => {
			vi.stubGlobal("scrollX", x);
			vi.stubGlobal("scrollY", y);
		});
		vi.stubGlobal("scrollTo", scrollTo);

		const replaceState = window.history.replaceState.bind(window.history);
		vi.spyOn(window.history, "replaceState").mockImplementation(
			(state, unused, url) => {
				replaceState(state, unused, url);
				vi.stubGlobal("scrollX", 0);
				vi.stubGlobal("scrollY", 96);
			},
		);

		renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const styling = document.getElementById("styling");
		if (!styling) throw new Error("Expected the styling section");

		act(() => notify([entry(styling, true)]));

		expect(window.location.hash).toBe("#styling");
		expect(scrollTo).toHaveBeenLastCalledWith(24, 640);
		expect(window.scrollX).toBe(24);
		expect(window.scrollY).toBe(640);
	});

	it("keeps a clicked hash active until its section reaches the viewport", () => {
		const { result } = renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const gettingStarted = document.getElementById("getting-started");
		const styling = document.getElementById("styling");
		if (!(gettingStarted && styling)) {
			throw new Error("Expected both documentation sections");
		}

		act(() => result.current.beginHashNavigation("styling"));
		act(() => notify([entry(gettingStarted, true)]));
		expect(result.current.currentHash).toBe("styling");

		act(() => notify([entry(styling, true)]));
		act(() => notify([entry(gettingStarted, false), entry(styling, true)]));

		expect(result.current.currentHash).toBe("styling");
	});

	it("ignores page-level fragments that are outside the documentation index", () => {
		window.history.replaceState({}, "", "/#docs");
		const { result } = renderHook(() =>
			useDocumentationScrollSpy(["getting-started", "styling"]),
		);
		const gettingStarted = document.getElementById("getting-started");
		if (!gettingStarted)
			throw new Error("Expected the getting started section");

		expect(result.current.currentHash).toBe("");
		act(() => notify([entry(gettingStarted, true)]));

		expect(result.current.currentHash).toBe("getting-started");
		expect(window.location.hash).toBe("#getting-started");
	});
});
