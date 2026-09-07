import { ApiClient } from "../../shared/ApiClient.js";
import { ChainReportService } from "../../shared/ChainReportService.js";
import { MissingApiKey } from "../../shared/MissingApiKey.js";
import { ReportStore } from "../../shared/stores/ReportStore.js";
import { SettingsStore } from "../../shared/stores/SettingsStore.js";
import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

/** @typedef {import("../../shared/ApiClient.js").ApiClient} ApiClient */
/** @typedef {import("../../shared/ChainReportService.js").ChainReportService} ChainReportService */
/** @typedef {import("../../shared/stores/SettingsStore.js").SettingsStore} SettingsStore */
/** @typedef {import("../../shared/stores/ReportStore.js").ReportStore} ReportStore */
/** @typedef {(apiKey: string) => ApiClient} ApiClientFactory */
/** @typedef {(apiClient: ApiClient) => ChainReportService} ChainReportServiceFactory */

const CACHE_TTL_MS = 30 * 60 * 1000;

/**
 * @param {string} apiKey
 * @returns {ApiClient}
 */
function defaultApiClientFactory(apiKey) {
    return new ApiClient(apiKey);
}

/**
 * @param {ApiClient} apiClient
 * @returns {ChainReportService}
 */
function defaultChainReportServiceFactory(apiClient) {
    return new ChainReportService(apiClient);
}

export class FactionController {
    /**
     * @param {SettingsStore} [settingsStore]
     * @param {ApiClientFactory} [apiClientFactory]
     * @param {ReportStore} [reportStore]
     * @param {ChainReportServiceFactory} [chainReportServiceFactory]
     */
    constructor(
        settingsStore = new SettingsStore(),
        apiClientFactory = defaultApiClientFactory,
        reportStore = new ReportStore(),
        chainReportServiceFactory = defaultChainReportServiceFactory,
    ) {
        this.viewModel = new FactionViewModel();
        this.settingsStore = settingsStore;
        this.apiClientFactory = apiClientFactory;
        this.reportStore = reportStore;
        this.chainReportServiceFactory = chainReportServiceFactory;
        this.view = new FactionView(this.viewModel, {
            onSave: () => this.settingsStore.setApiKey(this.viewModel.apiKey),
        });
    }

    async init() {
        const storedKey = await this.settingsStore.getApiKey();
        this.viewModel.apiKey = storedKey;
        this.viewModel.eventType = "detecting";

        this.wrapper = document.createElement("div");
        this.wrapper.dataset.tcr = "faction-panel";

        this.#injectWrapper();
        this.view.render(this.wrapper);

        const storedReport = await this.reportStore.getReport();

        if (
            storedReport !== null &&
            Date.now() - storedReport.lastInteraction < CACHE_TTL_MS
        ) {
            // Cache hit: render cached data and skip the full fetch chain.
            this.viewModel.attackBreakdown = storedReport.chainBreakdown;
            this.view.updateAttackBreakdown(this.viewModel.attackBreakdown);
            return;
        }

        // Cache miss: optimistically display any stale cached breakdown while
        // the fresh fetch is in flight, without blocking event detection.
        if (
            storedReport?.chainBreakdown !== undefined &&
            this.viewModel.attackBreakdown === null
        ) {
            this.viewModel.attackBreakdown = storedReport.chainBreakdown;
            this.view.updateAttackBreakdown(this.viewModel.attackBreakdown);
        }

        this.#observeWrapper();
        await this.#detectEvent();
    }

    async #detectEvent() {
        const apiClient = this.apiClientFactory(this.viewModel.apiKey);

        try {
            const [rankedwarsResponse, chainResponse] = await Promise.all([
                apiClient.get("/faction/rankedwars"),
                apiClient.get("/faction/chain"),
            ]);

            const currentWar = rankedwarsResponse.rankedwars[0];
            const warActive = currentWar.end === null;
            const chainActive = chainResponse.chain.end === null;

            if (warActive) {
                const chainsResponse = await apiClient.get("/faction/chains", {
                    from: String(currentWar.start),
                });
                this.viewModel.chainIds = chainsResponse.chains.map(
                    (entry) => entry.id,
                );
                const chainReportService =
                    this.chainReportServiceFactory(apiClient);
                const report = await chainReportService.aggregate(
                    this.viewModel.chainIds,
                );
                await this.reportStore.setReport({
                    chainBreakdown: report.chainBreakdown,
                    lastInteraction: Date.now(),
                });
                this.viewModel.attackBreakdown = report.chainBreakdown;
                this.viewModel.eventType = "war";
            } else if (chainActive) {
                this.viewModel.eventType = "chain";
            } else {
                this.viewModel.eventType = "none";
            }
        } catch (error) {
            if (error instanceof MissingApiKey) {
                this.viewModel.eventType = "no-api-key";
            } else {
                this.viewModel.eventType = "unavailable";
            }
        }

        this.view.updateEventType(this.viewModel.eventType);
        this.view.updateAttackBreakdown(this.viewModel.attackBreakdown);
    }

    #injectWrapper() {
        const mountElement = document.querySelector("#faction_war_list_id");
        if (!mountElement) return;

        mountElement.insertAdjacentElement("afterend", this.wrapper);
    }

    #observeWrapper() {
        const observer = new MutationObserver(() => {
            if (this.wrapper.isConnected) return;

            this.#injectWrapper();
            this.view.render(this.wrapper);
        });

        observer.observe(document, { childList: true, subtree: true });
    }
}
