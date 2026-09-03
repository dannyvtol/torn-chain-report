import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MissingApiKey } from "../../shared/MissingApiKey.js";
import { FactionController } from "./FactionController.js";

/** @typedef {import("../../shared/stores/SettingsStore.js").SettingsStore} SettingsStore */
/** @typedef {import("../../shared/ApiClient.js").ApiClient} ApiClient */

/** @returns {SettingsStore} */
function makeStubStore({ apiKey = "" } = {}) {
    return {
        getApiKey: vi.fn().mockResolvedValue(apiKey),
        setApiKey: vi.fn().mockResolvedValue(undefined),
    };
}

/**
 * @param {{ rankedwarsEnd?: null | number, chainEnd?: null | number }} [options]
 * @returns {(apiKey: string) => ApiClient}
 */
function makeStubApiClientFactory({ rankedwarsEnd = 0, chainEnd = 0 } = {}) {
    return () => ({
        get: vi.fn().mockImplementation((path) => {
            if (path === "/faction/rankedwars") {
                return Promise.resolve({
                    rankedwars: [{ end: rankedwarsEnd }],
                });
            }
            if (path === "/faction/chain") {
                return Promise.resolve({ chain: { end: chainEnd } });
            }
            return Promise.reject(new Error(`Unexpected path: ${path}`));
        }),
    });
}

function makeMissingApiKeyFactory() {
    return () => ({
        get: vi.fn().mockRejectedValue(new MissingApiKey()),
    });
}

function makeErrorFactory() {
    return () => ({
        get: vi.fn().mockRejectedValue(new Error("HTTP 503")),
    });
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

    describe("event detection", () => {
        it("sets eventType to 'detecting' immediately before fetch resolves", async () => {
            let capturedEventType;
            const factory = () => ({
                get: vi.fn().mockImplementation(() => {
                    capturedEventType = controller.viewModel.eventType;
                    return new Promise(() => {}); // never resolves
                }),
            });
            const controller = new FactionController(
                makeStubStore({ apiKey: "k" }),
                factory,
            );
            controller.init(); // intentionally not awaited
            await Promise.resolve(); // flush microtasks up to the fetch calls
            expect(capturedEventType).toBe("detecting");
        });

        it("sets eventType to 'war' when rankedwars[0].end is null", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "k" }),
                makeStubApiClientFactory({ rankedwarsEnd: null, chainEnd: 0 }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("war");
        });

        it("sets eventType to 'chain' when chain.end is null and no active war", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "k" }),
                makeStubApiClientFactory({ rankedwarsEnd: 0, chainEnd: null }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("chain");
        });

        it("sets eventType to 'none' when both rankedwars and chain have non-null end", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "k" }),
                makeStubApiClientFactory({ rankedwarsEnd: 1, chainEnd: 1 }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("none");
        });

        it("war takes priority over chain when both have null end", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "k" }),
                makeStubApiClientFactory({
                    rankedwarsEnd: null,
                    chainEnd: null,
                }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("war");
        });

        it("sets eventType to 'no-api-key' on MissingApiKey error", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "k" }),
                makeMissingApiKeyFactory(),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("no-api-key");
        });

        it("sets eventType to 'unavailable' on other errors", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "k" }),
                makeErrorFactory(),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("unavailable");
        });
    });
});
