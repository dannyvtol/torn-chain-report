import { afterEach, describe, expect, it } from "vitest";

import { createPanel } from "./createPanel.js";

describe("createPanel()", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("returns a breakdownContainer element", () => {
        const { breakdownContainer } = createPanel();
        expect(breakdownContainer).toBeInstanceOf(HTMLElement);
    });

    it("breakdownContainer is appended inside the root element", () => {
        const { root, breakdownContainer } = createPanel();
        expect(root.contains(breakdownContainer)).toBe(true);
    });

    it("breakdownContainer is empty by default", () => {
        const { breakdownContainer } = createPanel();
        expect(breakdownContainer.childElementCount).toBe(0);
    });
});
