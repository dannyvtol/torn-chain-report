import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

describe("FactionView", () => {
    let mountElement;
    let viewModel;
    let view;

    beforeEach(() => {
        mountElement = document.createElement("div");
        mountElement.id = "faction_war_list_id";
        document.body.appendChild(mountElement);
        viewModel = new FactionViewModel();
        view = new FactionView(viewModel);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("injects a panel as child of the mount element", () => {
        view.render(mountElement);
        expect(mountElement.firstElementChild).not.toBeNull();
    });

    it("panel has title-black header class", () => {
        view.render(mountElement);
        const panel = mountElement.firstElementChild;
        expect(panel.querySelector(".title-black")).not.toBeNull();
    });

    it("panel contains a span with text 'Torn API-key'", () => {
        view.render(mountElement);
        const span = mountElement.firstElementChild.querySelector("span");
        expect(span?.textContent).toBe("Torn API-key");
    });

    it("panel contains a password input", () => {
        view.render(mountElement);
        const input = mountElement.firstElementChild.querySelector(
            "input[type='password']",
        );
        expect(input).not.toBeNull();
    });

    it("panel contains a Save button", () => {
        view.render(mountElement);
        const button = mountElement.firstElementChild.querySelector("button");
        expect(button?.textContent).toBe("Save");
    });

    it("pre-populates input with viewModel.apiKey", () => {
        viewModel.apiKey = "mykey";
        view.render(mountElement);
        const input = mountElement.firstElementChild.querySelector(
            "input[type='password']",
        );
        expect(input?.value).toBe("mykey");
    });

    it("Save button click updates viewModel.apiKey from input value", () => {
        view.render(mountElement);
        const panel = mountElement.firstElementChild;
        const input = panel.querySelector("input[type='password']");
        const button = panel.querySelector("button");
        input.value = "newkey";
        button.click();
        expect(viewModel.apiKey).toBe("newkey");
    });
});
