import { describe, expect, it, vi } from "vitest";
import { mergeRefs } from "../src/merge-refs";

describe("mergeRefs", () => {
	it("uses ref(null) teardown for React 18", () => {
		const cleanupRef = vi.fn();
		const ref = vi.fn((_value: HTMLInputElement | null) => cleanupRef);
		const mergedRef = mergeRefs("18.3.1", ref);
		const input = {} as HTMLInputElement;

		const returnedCleanup = mergedRef(input);
		expect(returnedCleanup).toBeUndefined();

		mergedRef(null);
		expect(cleanupRef).toHaveBeenCalledTimes(1);
		expect(ref).toHaveBeenCalledTimes(1);
	});

	it("returns ref cleanup for React 19", () => {
		const cleanupRef = vi.fn();
		const ref = vi.fn((_value: HTMLInputElement | null) => cleanupRef);
		const mergedRef = mergeRefs("19.2.7", ref);
		const input = {} as HTMLInputElement;

		const returnedCleanup = mergedRef(input);
		expect(returnedCleanup).toBeTypeOf("function");
		if (typeof returnedCleanup === "function") {
			returnedCleanup();
		}

		expect(cleanupRef).toHaveBeenCalledTimes(1);
		expect(ref).toHaveBeenCalledTimes(1);
	});
});
