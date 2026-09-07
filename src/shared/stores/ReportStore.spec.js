import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReportStore } from "./ReportStore.js";

describe("ReportStore", () => {
    beforeEach(() => {
        globalThis.GM = {
            getValue: vi.fn(),
            setValue: vi.fn(),
        };
    });

    it("getReport returns value from GM.getValue with key 'report'", async () => {
        const stored = { chainBreakdown: { leave: 3 } };
        globalThis.GM.getValue.mockResolvedValue(stored);
        const store = new ReportStore();
        const result = await store.getReport();
        expect(result).toBe(stored);
        expect(globalThis.GM.getValue).toHaveBeenCalledWith("report", null);
    });

    it("setReport calls GM.setValue with key 'report' and the given value", async () => {
        globalThis.GM.setValue.mockResolvedValue(undefined);
        const report = { chainBreakdown: { leave: 5 } };
        const store = new ReportStore();
        await store.setReport(report);
        expect(globalThis.GM.setValue).toHaveBeenCalledWith("report", report);
    });

    describe("isFresh", () => {
        it("returns false when report is null", () => {
            const store = new ReportStore();
            expect(store.isFresh(null)).toBe(false);
        });

        it("returns true when lastInteraction is under 30 minutes ago", () => {
            const store = new ReportStore();
            const report = {
                chainBreakdown: { leave: 1 },
                lastInteraction: Date.now() - 5 * 60 * 1000,
            };
            expect(store.isFresh(report)).toBe(true);
        });

        it("returns false when lastInteraction is exactly 30 minutes ago", () => {
            const store = new ReportStore();
            const report = {
                chainBreakdown: { leave: 1 },
                lastInteraction: Date.now() - 30 * 60 * 1000,
            };
            expect(store.isFresh(report)).toBe(false);
        });

        it("returns false when lastInteraction is over 30 minutes ago", () => {
            const store = new ReportStore();
            const report = {
                chainBreakdown: { leave: 1 },
                lastInteraction: Date.now() - 31 * 60 * 1000,
            };
            expect(store.isFresh(report)).toBe(false);
        });
    });
});
