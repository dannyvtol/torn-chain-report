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
});
