import { afterEach, describe, expect, it } from "vitest";

import { createPanel } from "./createPanel.js";

describe("createPanel", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("returns a root element containing a header and container", () => {
        const { root } = createPanel();
        expect(root.children.length).toBe(2);
    });

    it("root contains a title-black header with text 'Chain Report'", () => {
        const { root } = createPanel();
        const header = root.querySelector(".title-black");
        expect(header?.textContent).toBe("Chain Report");
    });

    it("root contains a span with text 'Torn API-key'", () => {
        const { root } = createPanel();
        const span = root.querySelector("span");
        expect(span?.textContent).toBe("Torn API-key");
    });

    it("returns a password input ref", () => {
        const { input } = createPanel();
        expect(input.tagName).toBe("INPUT");
        expect(input.type).toBe("password");
    });

    it("returns a button ref with text 'Save'", () => {
        const { button } = createPanel();
        expect(button.tagName).toBe("BUTTON");
        expect(button.textContent).toBe("Save");
    });

    it("pre-populates input with initialValue", () => {
        const { input } = createPanel({ initialValue: "abc123" });
        expect(input.value).toBe("abc123");
    });

    it("defaults initialValue to empty string", () => {
        const { input } = createPanel();
        expect(input.value).toBe("");
    });

    it("input and button refs are inside root", () => {
        const { root, input, button } = createPanel();
        expect(root.contains(input)).toBe(true);
        expect(root.contains(button)).toBe(true);
    });
});
