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
});
