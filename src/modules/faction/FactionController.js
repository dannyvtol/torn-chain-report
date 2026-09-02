import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

export class FactionController {
    constructor() {
        this.vm = new FactionViewModel();
        this.view = new FactionView(this.vm);
    }

    init() {
        const mountEl = document.querySelector("#faction_war_list_id");
        if (!mountEl) return;
        this.view.render(mountEl);
    }
}
