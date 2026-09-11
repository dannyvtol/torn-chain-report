import { describe, expect, it } from "vitest";

import { FactionViewModel } from "./FactionViewModel.js";

describe("FactionViewModel", () => {
    it("apiKey getter returns empty string initially", () => {
        const viewModel = new FactionViewModel();
        expect(viewModel.apiKey).toBe("");
    });

    it("apiKey setter stores the value and getter returns it", () => {
        const viewModel = new FactionViewModel();
        viewModel.apiKey = "abc123";
        expect(viewModel.apiKey).toBe("abc123");
    });

    it("eventType getter returns 'detecting' initially", () => {
        const viewModel = new FactionViewModel();
        expect(viewModel.eventType).toBe("detecting");
    });

    it("eventType setter stores the value and getter returns it", () => {
        const viewModel = new FactionViewModel();
        viewModel.eventType = "war";
        expect(viewModel.eventType).toBe("war");
    });

    it("chainIds getter returns empty array initially", () => {
        const viewModel = new FactionViewModel();
        expect(viewModel.chainIds).toEqual([]);
    });

    it("chainIds setter stores the value and getter returns it", () => {
        const viewModel = new FactionViewModel();
        viewModel.chainIds = [101, 202, 303];
        expect(viewModel.chainIds).toEqual([101, 202, 303]);
    });

    it("attackBreakdown getter returns null initially", () => {
        const viewModel = new FactionViewModel();
        expect(viewModel.attackBreakdown).toBeNull();
    });

    it("attackBreakdown setter stores the value and getter returns it", () => {
        const viewModel = new FactionViewModel();
        viewModel.attackBreakdown = { leave: 3, mug: 1 };
        expect(viewModel.attackBreakdown).toEqual({ leave: 3, mug: 1 });
    });

    it("attackBreakdown setter accepts null and getter returns null", () => {
        const viewModel = new FactionViewModel();
        viewModel.attackBreakdown = { leave: 1 };
        viewModel.attackBreakdown = null;
        expect(viewModel.attackBreakdown).toBeNull();
    });
});
