import { SettingsStore } from "../../shared/stores/SettingsStore.js";
import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

/** @typedef {import("../../shared/stores/SettingsStore.js").SettingsStore} SettingsStore */

export class FactionController {
    /** @param {SettingsStore} [settingsStore] */
    constructor(settingsStore = new SettingsStore()) {
        this.viewModel = new FactionViewModel();
        this.settingsStore = settingsStore;
        this.view = new FactionView(this.viewModel, {
            onSave: () => this.settingsStore.setApiKey(this.viewModel.apiKey),
        });
    }

    async init() {
        const storedKey = await this.settingsStore.getApiKey();
        this.viewModel.apiKey = storedKey;

        this.wrapper = document.createElement("div");
        this.wrapper.dataset.tcr = "faction-panel";

        this.#injectWrapper();
        this.#observeWrapper();

        this.view.render(this.wrapper);
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
