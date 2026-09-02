import { createPanel } from "./ui/createPanel.js";

/** @typedef {import("./FactionViewModel.js").FactionViewModel} FactionViewModel */

export class FactionView {
    /**
     * @param {FactionViewModel} viewModel
     */
    constructor(viewModel) {
        this.viewModel = viewModel;
    }

    /**
     * Renders the Chain Report panel into the given wrapper element.
     * @param {Element} wrapper
     */
    render(wrapper) {
        const { root, input, button } = createPanel({
            initialValue: this.viewModel.apiKey,
        });

        button.addEventListener("click", () => {
            this.viewModel.apiKey = input.value;
        });

        wrapper.append(root);
    }
}
