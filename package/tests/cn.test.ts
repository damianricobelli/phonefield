import { describe, expect, it } from "vitest";
import { cn } from "../src/internal/cn";

describe("cn", () => {
  it("joins truthy values with spaces", () => {
    expect(cn("one", "two", "three")).toBe("one two three");
  });

  it("ignores falsy values", () => {
    expect(cn("one", undefined, null, false, "", "two")).toBe("one two");
  });

  it("returns an empty string when all values are falsy", () => {
    expect(cn(undefined, null, false, "")).toBe("");
  });
});
