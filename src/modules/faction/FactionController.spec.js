import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MissingApiKey } from "../../shared/MissingApiKey.js";
import { FactionController } from "./FactionController.js";

/** @typedef {import("../../shared/stores/SettingsStore.js").SettingsStore} SettingsStore */
/** @typedef {import("../../shared/ApiClient.js").ApiClient} ApiClient */
/** @typedef {import("../../shared/stores/ReportStore.js").ReportStore} ReportStore */
/** @typedef {import("../../shared/ChainReportService.js").ChainReportService} ChainReportService */

/** @returns {SettingsStore} */
function makeStubStore({ apiKey = "" } = {}) {
    return {
        getApiKey: vi.fn().mockResolvedValue(apiKey),
        setApiKey: vi.fn().mockResolvedValue(undefined),
    };
}

/** @returns {ReportStore} */
function makeStubReportStore() {
    return {
        getReport: vi.fn().mockResolvedValue(null),
        setReport: vi.fn().mockResolvedValue(undefined),
    };
}

/**
 * @param {{ chainBreakdown?: Record<string, number>, error?: Error }} [options]
 * @returns {(apiClient: ApiClient) => ChainReportService}
 */
function makeStubChainReportServiceFactory({
    chainBreakdown = { leave: 0 },
    error = undefined,
} = {}) {
    return () => ({
        aggregate: vi.fn().mockImplementation(() => {
            if (error) return Promise.reject(error);
            return Promise.resolve({ chainBreakdown });
        }),
    });
}

/**
 * @param {{
 *   rankedwarsEnd?: null | number,
 *   rankedwarsStart?: number,
 *   chainEnd?: null | number,
 *   chains?: Array<{ id: number, end: number | null }>,
 *   chainsError?: Error,
 *   userId?: number,
 * }} [options]
 * @returns {(apiKey: string) => ApiClient}
 */
function makeStubApiClientFactory({
    rankedwarsEnd = 0,
    rankedwarsStart = 1000000,
    chainEnd = 0,
    chains = [],
    chainsError = undefined,
    userId = 1,
} = {}) {
    return () => ({
        get: vi.fn().mockImplementation((path) => {
            if (path === "/faction/rankedwars") {
                return Promise.resolve({
                    rankedwars: [
                        { start: rankedwarsStart, end: rankedwarsEnd },
                    ],
                });
            }
            if (path === "/faction/chain") {
                return Promise.resolve({ chain: { end: chainEnd } });
            }
            if (path === "/faction/chains") {
                if (chainsError) return Promise.reject(chainsError);
                return Promise.resolve({ chains });
            }
            if (path === "/user/basic") {
                return Promise.resolve({ profile: { id: userId } });
            }
            if (path.endsWith("/chainreport")) {
                return Promise.resolve({
                    chainreport: { attackers: [], bonuses: [] },
                });
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

        globalThis.GM = {
            getValue: vi.fn().mockResolvedValue(null),
            setValue: vi.fn().mockResolvedValue(undefined),
        };
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
        expect(wrapper?.querySelector(".cont-gray10 span")?.textContent).toBe(
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
                makeStubStore({ apiKey: "stub-key" }),
                factory,
            );
            controller.init(); // intentionally not awaited
            await Promise.resolve(); // flush microtasks up to the fetch calls
            expect(capturedEventType).toBe("detecting");
        });

        it("sets eventType to 'war' when rankedwars[0].end is null", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({ rankedwarsEnd: null, chainEnd: 0 }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("war");
        });

        it("sets eventType to 'chain' when chain.end is null and no active war", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({ rankedwarsEnd: 0, chainEnd: null }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("chain");
        });

        it("sets eventType to 'none' when both rankedwars and chain have non-null end", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({ rankedwarsEnd: 1, chainEnd: 1 }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("none");
        });

        it("war takes priority over chain when both have null end", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
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
                makeStubStore({ apiKey: "stub-key" }),
                makeMissingApiKeyFactory(),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("no-api-key");
        });

        it("sets eventType to 'unavailable' on other errors", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeErrorFactory(),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("unavailable");
        });
    });

    describe("chain ID collection", () => {
        it("populates chainIds with completed chain IDs when war is active", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({
                    rankedwarsEnd: null,
                    chains: [
                        { id: 101, end: 1700000000 },
                        { id: 102, end: 1700001000 },
                    ],
                }),
            );
            await controller.init();
            expect(controller.viewModel.chainIds).toEqual([101, 102]);
        });

        it("leaves chainIds as empty array when no completed chains exist", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({
                    rankedwarsEnd: null,
                    chains: [],
                }),
            );
            await controller.init();
            expect(controller.viewModel.chainIds).toEqual([]);
        });

        it("sets eventType to 'unavailable' when chains fetch throws", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({
                    rankedwarsEnd: null,
                    chainsError: new Error("HTTP 503"),
                }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("unavailable");
        });

        it("fetches chains with from set to war start as a string", async () => {
            const factory = makeStubApiClientFactory({
                rankedwarsEnd: null,
                rankedwarsStart: 1750000000,
                chains: [],
            });
            const stubClient = factory("stub-key");
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                () => stubClient,
            );
            await controller.init();
            const chainsCall = stubClient.get.mock.calls.find(
                ([path]) => path === "/faction/chains",
            );
            expect(chainsCall[1]).toEqual({ from: "1750000000" });
        });

        it("does not fetch chains when eventType is not 'war'", async () => {
            const factory = makeStubApiClientFactory({
                rankedwarsEnd: 1,
                chainEnd: null,
            });
            const stubClient = factory("stub-key");
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                () => stubClient,
            );
            await controller.init();
            const chainsCalls = stubClient.get.mock.calls.filter(
                ([path]) => path === "/faction/chains",
            );
            expect(chainsCalls).toHaveLength(0);
        });
    });

    describe("chain report aggregation", () => {
        it("calls aggregate with collected chainIds when war is active", async () => {
            const chainReportServiceFactory = makeStubChainReportServiceFactory();
            const stubService = chainReportServiceFactory();
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({
                    rankedwarsEnd: null,
                    chains: [
                        { id: 101, end: 1700000000 },
                        { id: 102, end: 1700001000 },
                    ],
                }),
                makeStubReportStore(),
                () => stubService,
            );
            await controller.init();
            expect(stubService.aggregate).toHaveBeenCalledWith([101, 102]);
        });

        it("persists aggregate result to ReportStore when war is active", async () => {
            const aggregatedReport = { chainBreakdown: { leave: 3 } };
            const reportStore = makeStubReportStore();
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({
                    rankedwarsEnd: null,
                    chains: [{ id: 101, end: 1700000000 }],
                }),
                reportStore,
                makeStubChainReportServiceFactory({
                    chainBreakdown: aggregatedReport.chainBreakdown,
                }),
            );
            await controller.init();
            expect(reportStore.setReport).toHaveBeenCalledWith(aggregatedReport);
        });

        it("does not call aggregate when eventType is not 'war'", async () => {
            const chainReportServiceFactory = makeStubChainReportServiceFactory();
            const stubService = chainReportServiceFactory();
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({ rankedwarsEnd: 1, chainEnd: null }),
                makeStubReportStore(),
                () => stubService,
            );
            await controller.init();
            expect(stubService.aggregate).not.toHaveBeenCalled();
        });

        it("sets eventType to 'unavailable' when aggregate throws", async () => {
            const controller = new FactionController(
                makeStubStore({ apiKey: "stub-key" }),
                makeStubApiClientFactory({
                    rankedwarsEnd: null,
                    chains: [{ id: 101, end: 1700000000 }],
                }),
                makeStubReportStore(),
                makeStubChainReportServiceFactory({
                    error: new Error("HTTP 401"),
                }),
            );
            await controller.init();
            expect(controller.viewModel.eventType).toBe("unavailable");
        });
    });
});
