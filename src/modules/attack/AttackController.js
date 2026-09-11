import { AttackView } from "./AttackView.js";
import { AttackViewModel } from "./AttackViewModel.js";

export class AttackController {
    constructor() {
        this.viewModel = new AttackViewModel();
        this.view = new AttackView(this.viewModel);
    }

    async init() {
        this.wrapper = document.createElement("div");
        this.wrapper.dataset.tcr = "attack-panel";

        document.body.insertAdjacentElement("afterbegin", this.wrapper);
        this.view.render(this.wrapper);
    }
}
