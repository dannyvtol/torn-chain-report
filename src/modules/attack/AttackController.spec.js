import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AttackController } from "./AttackController.js";

/** @typedef {import("../../shared/stores/ReportStore.js").ReportStore} ReportStore */

/** @returns {ReportStore} */
function makeStubReportStore() {
    return {
        getReport: vi.fn().mockResolvedValue(null),
        setReport: vi.fn().mockResolvedValue(undefined),
        isFresh: vi.fn().mockReturnValue(false),
    };
}

describe("AttackController", () => {
    beforeEach(() => {
        globalThis.GM = {
            getValue: vi.fn().mockResolvedValue(null),
            setValue: vi.fn().mockResolvedValue(undefined),
        };
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("constructor creates a viewModel", () => {
        const controller = new AttackController(makeStubReportStore());
        expect(controller.viewModel).toBeDefined();
    });

    it("constructor creates a view", () => {
        const controller = new AttackController(makeStubReportStore());
        expect(controller.view).toBeDefined();
    });

    it("init() prepends a wrapper with data-tcr='attack-panel' as the first body child", async () => {
        const controller = new AttackController(makeStubReportStore());
        await controller.init();
        const wrapper = document.body.firstElementChild;
        expect(wrapper).not.toBeNull();
        expect(wrapper.dataset.tcr).toBe("attack-panel");
    });

    it("init() does not add content inside the wrapper", async () => {
        const controller = new AttackController(makeStubReportStore());
        await controller.init();
        const wrapper = document.body.firstElementChild;
        expect(wrapper.childElementCount).toBe(0);
    });

    it("init() calling twice does not add a second wrapper", async () => {
        const controller = new AttackController(makeStubReportStore());
        await controller.init();
        await controller.init();
        const wrappers = document.body.querySelectorAll("[data-tcr='attack-panel']");
        expect(wrappers).toHaveLength(1);
    });
});
