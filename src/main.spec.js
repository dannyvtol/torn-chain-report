import { afterEach, describe, expect, it, vi } from "vitest";

describe("main.js entry point", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it("calls AttackController.init() when pathname is /page.php and sid is attack", async () => {
        vi.stubGlobal("location", {
            pathname: "/page.php",
            search: "?sid=attack",
        });

        const mockInit = vi.fn().mockResolvedValue(undefined);

        vi.doMock("./modules/attack/AttackController.js", () => ({
            AttackController: vi.fn().mockImplementation(function () {
                this.init = mockInit;
            }),
        }));
        vi.doMock("./modules/faction/FactionController.js", () => ({
            FactionController: vi.fn().mockImplementation(function () {
                this.init = vi.fn();
            }),
        }));

        await import("./main.js");
        expect(mockInit).toHaveBeenCalledOnce();
    });

    it("does not call AttackController.init() when pathname is /page.php but sid is not attack", async () => {
        vi.stubGlobal("location", {
            pathname: "/page.php",
            search: "?sid=profile",
        });

        const mockInit = vi.fn();

        vi.doMock("./modules/attack/AttackController.js", () => ({
            AttackController: vi.fn().mockImplementation(function () {
                this.init = mockInit;
            }),
        }));
        vi.doMock("./modules/faction/FactionController.js", () => ({
            FactionController: vi.fn().mockImplementation(function () {
                this.init = vi.fn();
            }),
        }));

        await import("./main.js");
        expect(mockInit).not.toHaveBeenCalled();
    });

    it("does not call AttackController.init() when sid is attack but pathname is not /page.php", async () => {
        vi.stubGlobal("location", {
            pathname: "/factions.php",
            search: "?sid=attack",
        });

        const mockInit = vi.fn();

        vi.doMock("./modules/attack/AttackController.js", () => ({
            AttackController: vi.fn().mockImplementation(function () {
                this.init = mockInit;
            }),
        }));
        vi.doMock("./modules/faction/FactionController.js", () => ({
            FactionController: vi.fn().mockImplementation(function () {
                this.init = vi.fn();
            }),
        }));

        await import("./main.js");
        expect(mockInit).not.toHaveBeenCalled();
    });
});
