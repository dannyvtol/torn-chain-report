import { describe, expect, it } from "vitest";

import { formatNumber } from "./formatNumber.js";

describe("formatNumber()", () => {
    it("formats zero as '0'", () => {
        expect(formatNumber(0)).toBe("0");
    });

    it("formats a small number without separators", () => {
        expect(formatNumber(999)).toBe("999");
    });

    it("formats a four-digit number with a thousands separator", () => {
        expect(formatNumber(1000)).toBe("1,000");
    });

    it("formats a large number with multiple separators", () => {
        expect(formatNumber(1234567)).toBe("1,234,567");
    });
});
