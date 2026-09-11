import { afterEach, describe, expect, it, vi } from "vitest";

import { AttackController } from "./AttackController.js";
import { AttackView } from "./AttackView.js";

describe("AttackController", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        vi.restoreAllMocks();
    });

    it("constructor creates a viewModel and a view", () => {
        const controller = new AttackController();
        expect(controller.viewModel).toBeDefined();
        expect(controller.view).toBeDefined();
    });

    it("init() prepends a wrapper with data-tcr='attack-panel' as the first body child", async () => {
        const controller = new AttackController();
        await controller.init();
        const wrapper = document.body.firstElementChild;
        expect(wrapper).not.toBeNull();
        expect(wrapper.dataset.tcr).toBe("attack-panel");
    });

    it("init() calls view.render with the wrapper", async () => {
        const renderSpy = vi.spyOn(AttackView.prototype, "render");
        const controller = new AttackController();
        await controller.init();
        expect(renderSpy).toHaveBeenCalledWith(controller.wrapper);
    });
});
