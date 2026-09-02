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

    it("init() injects a panel after #faction_war_list_id", () => {
        const controller = new FactionController();
        controller.init();
        const mountElement = document.querySelector("#faction_war_list_id");
        const panel = mountElement?.nextElementSibling;
        expect(panel).not.toBeNull();
        expect(panel.classList.contains("profile-wrapper")).toBe(true);
    });

    it("init() includes Torn API-key label in the injected panel", () => {
        const controller = new FactionController();
        controller.init();
        const panel = document.querySelector(
            "#faction_war_list_id",
        )?.nextElementSibling;
        expect(panel?.querySelector("span")?.textContent).toBe("Torn API-key");
    });
});
