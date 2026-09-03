import { beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsStore } from "./SettingsStore.js";

describe("SettingsStore", () => {
    beforeEach(() => {
        globalThis.GM = {
            getValue: vi.fn(),
            setValue: vi.fn(),
        };
    });

    it("getApiKey returns value from GM.getValue", async () => {
        globalThis.GM.getValue.mockResolvedValue("stored-key");
        const store = new SettingsStore();
        const result = await store.getApiKey();
        expect(result).toBe("stored-key");
        expect(globalThis.GM.getValue).toHaveBeenCalledWith("apiKey", "");
    });

    it("setApiKey calls GM.setValue with the key", async () => {
        globalThis.GM.setValue.mockResolvedValue(undefined);
        const store = new SettingsStore();
        await store.setApiKey("my-key");
        expect(globalThis.GM.setValue).toHaveBeenCalledWith("apiKey", "my-key");
    });
});
