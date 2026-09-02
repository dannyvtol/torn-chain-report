import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FactionView } from "./FactionView.js";

describe("FactionView", () => {
    let mountEl;
    let view;

    beforeEach(() => {
        mountEl = document.createElement("div");
        mountEl.id = "faction_war_list_id";
        document.body.appendChild(mountEl);
        view = new FactionView();
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
});
