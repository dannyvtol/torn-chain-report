/**
 * Builds the Chain Report API-key panel using DOM construction.
 * @param {{ initialValue?: string }} [options]
 * @returns {{ root: HTMLElement, input: HTMLInputElement, button: HTMLButtonElement }}
 */
export function createPanel({ initialValue = "" } = {}) {
    const root = document.createElement("div");
    root.className = "profile-wrapper medals-wrapper m-top10";

    const header = document.createElement("div");
    header.className = "menu-header";
    header.textContent = "Chain Report";

    const container = document.createElement("div");
    container.className = "profile-container";

    const description = document.createElement("div");
    description.className = "profile-container-description";

    const label = document.createElement("span");
    label.textContent = "Torn API-key";

    const input = document.createElement("input");
    input.type = "password";
    input.value = initialValue;

    const button = document.createElement("button");
    button.textContent = "Save";

    description.append(label, input, button);
    container.append(description);
    root.append(header, container);

    return { root, input, button };
}
