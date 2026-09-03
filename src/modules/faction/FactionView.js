import { createPanel } from "./ui/createPanel.js";

/** @typedef {import("./FactionViewModel.js").FactionViewModel} FactionViewModel */

export class FactionView {
    /**
     * @param {FactionViewModel} viewModel
     * @param {{ onSave?: () => void }} [options]
     */
    constructor(viewModel, { onSave } = {}) {
        this.viewModel = viewModel;
        this.onSave = onSave ?? null;
    }

    /**
     * Renders the Chain Report panel into the given wrapper element.
     * @param {Element} wrapper
     */
    render(wrapper) {
        const { root, input, button } = createPanel({
            initialValue: this.viewModel.apiKey,
        });

        input.addEventListener("input", () => {
            this.viewModel.apiKey = input.value;
        });

        button.addEventListener("click", async () => {
            await this.onSave?.();
        });

        wrapper.append(root);
    }
}
