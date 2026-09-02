import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FactionController } from "./FactionController.js";

describe("FactionController", () => {
    beforeEach(() => {
        const element = document.createElement("div");
        element.id = "faction_war_list_id";
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("init() injects a wrapper after #faction_war_list_id containing the panel", () => {
        const controller = new FactionController();
        controller.init();
        const mountElement = document.querySelector("#faction_war_list_id");
        const wrapper = mountElement?.nextElementSibling;
        expect(wrapper).not.toBeNull();
        expect(wrapper.querySelector(".title-black")).not.toBeNull();
    });

    it("init() includes Torn API-key label in the injected panel", () => {
        const controller = new FactionController();
        controller.init();
        const wrapper = document.querySelector(
            "#faction_war_list_id",
        )?.nextElementSibling;
        expect(wrapper?.querySelector("span")?.textContent).toBe(
            "Torn API-key",
        );
    });
});
