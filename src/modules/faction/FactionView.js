import { createPanel } from "./ui/createPanel.js";

export class FactionView {
    /**
     * @param {import("./FactionViewModel.js").FactionViewModel} vm
     */
    constructor(vm) {
        this.vm = vm;
    }

    /**
     * Renders the Chain Report panel immediately after mountEl.
     * @param {Element} mountEl
     */
    render(mountEl) {
        const { root, input, button } = createPanel({ initialValue: this.vm.apiKey });

        button.addEventListener("click", () => {
            this.vm.apiKey = input.value;
        });

        mountEl.insertAdjacentElement("afterend", root);
    }
}
