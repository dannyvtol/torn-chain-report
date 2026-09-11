import { ReportStore } from "../../shared/stores/ReportStore.js";
import { AttackView } from "./AttackView.js";
import { AttackViewModel } from "./AttackViewModel.js";

/** @typedef {import("../../shared/stores/ReportStore.js").ReportStore} ReportStore */

export class AttackController {
    /** @param {ReportStore} [reportStore] */
    constructor(reportStore = new ReportStore()) {
        this.viewModel = new AttackViewModel();
        this.view = new AttackView(this.viewModel);
        this.reportStore = reportStore;
    }

    async init() {
        if (this.wrapper?.isConnected) return;

        this.wrapper = document.createElement("div");
        this.wrapper.dataset.tcr = "attack-panel";

        document.body.insertAdjacentElement("afterbegin", this.wrapper);
        this.view.render(this.wrapper);
    }
}
