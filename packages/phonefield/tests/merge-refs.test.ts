import { describe, expect, it, vi } from "vitest";
import { mergeRefs } from "../src/merge-refs";

describe("mergeRefs", () => {
	it("returns a cleanup that runs callback-ref cleanups and clears object refs", () => {
		const cleanupRef = vi.fn();
		const callbackRef = vi.fn((_value: HTMLInputElement | null) => cleanupRef);
		const objectRef = { current: null as HTMLInputElement | null };
		const mergedRef = mergeRefs(callbackRef, objectRef);
		const input = {} as HTMLInputElement;

		const cleanup = mergedRef(input);
		expect(objectRef.current).toBe(input);
		expect(cleanup).toBeTypeOf("function");
		if (typeof cleanup === "function") cleanup();

		expect(cleanupRef).toHaveBeenCalledTimes(1);
		expect(callbackRef).toHaveBeenCalledTimes(1);
		expect(objectRef.current).toBeNull();
	});

	it("falls back to calling callback refs with null", () => {
		const callbackRef = vi.fn();
		const cleanup = mergeRefs<HTMLInputElement>(callbackRef)(
			{} as HTMLInputElement,
		);
		if (typeof cleanup === "function") cleanup();
		expect(callbackRef).toHaveBeenLastCalledWith(null);
	});
});
