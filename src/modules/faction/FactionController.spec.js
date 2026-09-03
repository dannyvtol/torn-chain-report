import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FactionController } from "./FactionController.js";

/** @returns {import("../../shared/stores/SettingsStore.js").SettingsStore} */
function makeStubStore({ apiKey = "" } = {}) {
    return {
        getApiKey: vi.fn().mockResolvedValue(apiKey),
        setApiKey: vi.fn().mockResolvedValue(undefined),
    };
}

describe("FactionController", () => {
    beforeEach(() => {
        const element = document.createElement("div");
        element.id = "faction_war_list_id";
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("init() injects a wrapper after #faction_war_list_id containing the panel", async () => {
        const controller = new FactionController(makeStubStore());
        await controller.init();
        const mountElement = document.querySelector("#faction_war_list_id");
        const wrapper = mountElement?.nextElementSibling;
        expect(wrapper).not.toBeNull();
        expect(wrapper.querySelector(".title-black")).not.toBeNull();
    });

    it("init() includes Torn API-key label in the injected panel", async () => {
        const controller = new FactionController(makeStubStore());
        await controller.init();
        const wrapper = document.querySelector(
            "#faction_war_list_id",
        )?.nextElementSibling;
        expect(wrapper?.querySelector("span")?.textContent).toBe(
            "Torn API-key",
        );
    });

    it("init() pre-fills viewModel.apiKey from the store", async () => {
        const store = makeStubStore({ apiKey: "stored-key" });
        const controller = new FactionController(store);
        await controller.init();
        expect(controller.viewModel.apiKey).toBe("stored-key");
    });

    it("init() pre-fills the password input with the stored key", async () => {
        const store = makeStubStore({ apiKey: "stored-key" });
        const controller = new FactionController(store);
        await controller.init();
        const wrapper = document.querySelector(
            "#faction_war_list_id",
        )?.nextElementSibling;
        const input = wrapper?.querySelector("input[type='password']");
        expect(input?.value).toBe("stored-key");
    });

    it("clicking Save persists viewModel.apiKey to the store", async () => {
        const store = makeStubStore();
        const controller = new FactionController(store);
        await controller.init();
        controller.viewModel.apiKey = "new-key";
        const wrapper = document.querySelector(
            "#faction_war_list_id",
        )?.nextElementSibling;
        const button = wrapper?.querySelector("button");
        button.click();
        expect(store.setApiKey).toHaveBeenCalledWith("new-key");
    });
});
