import { describe, expect, it } from "vitest";

import { AttackViewModel } from "./AttackViewModel.js";

describe("AttackViewModel", () => {
    it("chainBreakdown is null by default", () => {
        const viewModel = new AttackViewModel();
        expect(viewModel.chainBreakdown).toBeNull();
    });

    it("chainBreakdown setter updates the value", () => {
        const viewModel = new AttackViewModel();
        const breakdown = { leave: 2, mug: 0 };
        viewModel.chainBreakdown = breakdown;
        expect(viewModel.chainBreakdown).toEqual(breakdown);
    });
});
