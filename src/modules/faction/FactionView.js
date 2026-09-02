import { createPanel } from "./ui/createPanel.js";

export class FactionView {
    /**
     * @param {import("./FactionViewModel.js").FactionViewModel} viewModel
     */
    constructor(viewModel) {
        this.viewModel = viewModel;
    }

    /**
     * Renders the Chain Report panel immediately after mountElement.
     * @param {Element} mountElement
     */
    render(mountElement) {
        const { root, input, button } = createPanel({ initialValue: this.viewModel.apiKey });

        button.addEventListener("click", () => {
            this.viewModel.apiKey = input.value;
        });

        mountElement.insertAdjacentElement("afterend", root);
    }
}
