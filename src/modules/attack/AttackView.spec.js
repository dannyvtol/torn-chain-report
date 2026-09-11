import { afterEach, describe, expect, it } from "vitest";

import { AttackView } from "./AttackView.js";
import { AttackViewModel } from "./AttackViewModel.js";

describe("AttackView", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("render() appends nothing to the wrapper", () => {
        const view = new AttackView(new AttackViewModel());
        const wrapper = document.createElement("div");
        view.render(wrapper);
        expect(wrapper.childElementCount).toBe(0);
    });

    it("render() is safe to call multiple times without error", () => {
        const view = new AttackView(new AttackViewModel());
        const wrapper = document.createElement("div");
        expect(() => {
            view.render(wrapper);
            view.render(wrapper);
        }).not.toThrow();
    });
});
