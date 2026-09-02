/**
 * Builds the Chain Report API-key panel using DOM construction.
 * @param {{ initialValue?: string }} [options]
 * @returns {{ root: HTMLElement, input: HTMLInputElement, button: HTMLButtonElement }}
 */
export function createPanel({ initialValue = "" } = {}) {
    const root = document.createElement("div");

    const header = document.createElement("div");
    header.classList.add(
        "title-black",
        "m-top10",
        "tt-foldable-infobox",
        "tt-infobox-title",
        "top-round",
    );
    header.textContent = "Chain Report";

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

    return { root, input, button };
}
