import { EVENT_TYPE_LABELS } from "../eventTypeLabels.js";

/**
 * Builds the Chain Report API-key panel using DOM construction.
 * @param {{ initialValue?: string, initialEventType?: string }} [options]
 * @returns {{ root: HTMLElement, input: HTMLInputElement, button: HTMLButtonElement, statusElement: HTMLElement }}
 */
export function createPanel({
    initialValue = "",
    initialEventType = "detecting",
} = {}) {
    const root = document.createElement("div");

    const header = document.createElement("div");
    header.classList.add(
        "title-black",
        "m-top10",
        "tt-infobox-title",
        "top-round",
    );
    header.style = `
        display: flex;
        gap: 6px;
    `;

    const titleSpan = document.createElement("span");
    titleSpan.textContent = "Chain Report";

    const statusElement = document.createElement("span");
    statusElement.textContent =
        EVENT_TYPE_LABELS[initialEventType] ?? initialEventType;

    header.append(titleSpan, document.createTextNode("—"), statusElement);

    const container = document.createElement("div");
    container.classList.add("cont-gray10", "bottom-round", "tt-foldable");

    const form = document.createElement("div");

    const label = document.createElement("span");
    label.textContent = "Torn API-key";

    const input = document.createElement("input");
    input.type = "password";
    input.value = initialValue;

    const button = document.createElement("button");
    button.classList.add("torn-btn");
    button.style = "margin-top: 10px;";
    button.textContent = "Save";

    form.append(label, input);
    container.append(form, button);
    root.append(header, container);

    return { root, input, button, statusElement };
}
