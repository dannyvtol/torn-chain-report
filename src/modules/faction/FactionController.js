import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

export class FactionController {
    constructor() {
        this.viewModel = new FactionViewModel();
        this.view = new FactionView(this.viewModel);
    }

    init() {
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
