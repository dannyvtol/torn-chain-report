import { BREAKDOWN_FIELDS } from "../../shared/ChainReportService.js";
import { formatNumber } from "../../shared/formatNumber.js";
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

    /** @type {HTMLElement | null} */
    #breakdownContainer;

    /**
     * Renders the Chain Report panel into the given wrapper element.
     * @param {Element} wrapper
     */
    render(wrapper) {
        if (wrapper.childElementCount) return;

        const { root, input, button, statusElement, breakdownContainer } =
            createPanel({
                initialValue: this.viewModel.apiKey,
                initialEventType: this.viewModel.eventType,
            });

        this.#statusElement = statusElement;
        this.#breakdownContainer = breakdownContainer;

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

    /**
     * Renders or clears the attack breakdown description list in the panel.
     * When attackBreakdown is null, the <dl> is removed. Otherwise a <dl>
     * with one <dt>/<dd> pair per category is rendered.
     * @param {Record<string, number> | null} attackBreakdown
     */
    updateAttackBreakdown(attackBreakdown) {
        if (!this.#breakdownContainer) return;

        this.#breakdownContainer.innerHTML = "";

        if (!attackBreakdown) return;

        const descriptionList = document.createElement("dl");

        for (const field of BREAKDOWN_FIELDS) {
            const descriptionTerm = document.createElement("dt");
            descriptionTerm.textContent = field;

            const descriptionDetail = document.createElement("dd");
            descriptionDetail.textContent = formatNumber(
                attackBreakdown[field] ?? 0,
            );

            descriptionList.append(descriptionTerm, descriptionDetail);
        }

        this.#breakdownContainer.append(descriptionList);
    }
}
