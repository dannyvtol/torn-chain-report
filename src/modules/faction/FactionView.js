import { EVENT_TYPE_LABELS } from "./eventTypeLabels.js";
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
        /** @type {HTMLElement | null} */
        this.#statusElement = null;
    }

    /** @type {HTMLElement | null} */
    #statusElement;

    /**
     * Renders the Chain Report panel into the given wrapper element.
     * @param {Element} wrapper
     */
    render(wrapper) {
        const { root, input, button, statusElement } = createPanel({
            initialValue: this.viewModel.apiKey,
            initialEventType: this.viewModel.eventType,
        });

        this.#statusElement = statusElement;

        input.addEventListener("input", () => {
            this.viewModel.apiKey = input.value;
        });

        button.addEventListener("click", async () => {
            await this.onSave?.();
        });

        wrapper.append(root);
    }

    /**
     * Updates the status text displayed in the panel.
     * @param {string} eventType
     */
    updateEventType(eventType) {
        if (this.#statusElement) {
            this.#statusElement.textContent =
                EVENT_TYPE_LABELS[eventType] ?? eventType;
        }
    }
}
