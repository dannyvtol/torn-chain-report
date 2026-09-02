import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FactionView } from "./FactionView.js";
import { FactionViewModel } from "./FactionViewModel.js";

describe("FactionView", () => {
    let mountEl;
    let vm;
    let view;

    beforeEach(() => {
        mountEl = document.createElement("div");
        mountEl.id = "faction_war_list_id";
        document.body.appendChild(mountEl);
        vm = new FactionViewModel();
        view = new FactionView(vm);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("injects a panel immediately after the mount element", () => {
        view.render(mountEl);
        expect(mountEl.nextElementSibling).not.toBeNull();
    });

    it("panel has torn-native profile-wrapper class", () => {
        view.render(mountEl);
        const panel = mountEl.nextElementSibling;
        expect(panel.classList.contains("profile-wrapper")).toBe(true);
    });

    it("panel contains a span with text 'Torn API-key'", () => {
        view.render(mountEl);
        const span = mountEl.nextElementSibling.querySelector("span");
        expect(span?.textContent).toBe("Torn API-key");
    });

    it("panel contains a password input", () => {
        view.render(mountEl);
        const input = mountEl.nextElementSibling.querySelector(
            "input[type='password']",
        );
        expect(input).not.toBeNull();
    });

    it("panel contains a Save button", () => {
        view.render(mountEl);
        const button = mountEl.nextElementSibling.querySelector("button");
        expect(button?.textContent).toBe("Save");
    });

    it("pre-populates input with vm.apiKey", () => {
        vm.apiKey = "mykey";
        view.render(mountEl);
        const input = mountEl.nextElementSibling.querySelector(
            "input[type='password']",
        );
        expect(input?.value).toBe("mykey");
    });

    it("Save button click updates vm.apiKey from input value", () => {
        view.render(mountEl);
        const panel = mountEl.nextElementSibling;
        const input = panel.querySelector("input[type='password']");
        const button = panel.querySelector("button");
        input.value = "newkey";
        button.click();
        expect(vm.apiKey).toBe("newkey");
    });
});
