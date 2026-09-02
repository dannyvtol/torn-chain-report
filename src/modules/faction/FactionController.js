import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

export class FactionController {
    constructor() {
        this.viewModel = new FactionViewModel();
        this.view = new FactionView(this.viewModel);
    }

    init() {
        const mountElement = document.querySelector("#faction_war_list_id");
        if (!mountElement) return;
        this.view.render(mountElement);
    }
}
