import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

export class FactionController {
    constructor() {
        this.view = new FactionView();
        this.vm = new FactionViewModel();
    }

    init() {
        const mountEl = document.querySelector("#faction_war_list_id");
        if (!mountEl) return;
        this.view.render(mountEl);
    }
}
