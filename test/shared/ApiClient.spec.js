import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ApiClient } from "../../src/shared/ApiClient.js";
import { MissingApiKey } from "../../src/shared/MissingApiKey.js";

describe("MissingApiKey", () => {
    it("is an instance of Error", () => {
        expect(new MissingApiKey()).toBeInstanceOf(Error);
    });
});

describe("ApiClient", () => {
    describe("get()", () => {
        it("throws MissingApiKey when apiKey is null", async () => {
            const client = new ApiClient(null);
            await expect(client.get("/faction")).rejects.toBeInstanceOf(MissingApiKey);
        });

        it("throws MissingApiKey when apiKey is empty string", async () => {
            const client = new ApiClient("");
            await expect(client.get("/faction")).rejects.toBeInstanceOf(MissingApiKey);
        });

        describe("with a valid apiKey", () => {
            const apiKey = "abc123";
            let fetchSpy;

            beforeEach(() => {
                fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
                    ok: true,
                    json: vi.fn().mockResolvedValue({ data: "result" }),
                });
            });

            afterEach(() => {
                fetchSpy.mockRestore();
            });

            it("constructs the correct base URL with path", async () => {
                const client = new ApiClient(apiKey);
                await client.get("/faction");
                const calledUrl = fetchSpy.mock.calls[0][0];
                expect(calledUrl).toBe("https://api.torn.com/v2/faction");
            });

            it("appends query params via URLSearchParams", async () => {
                const client = new ApiClient(apiKey);
                await client.get("/faction", { selections: "chain", limit: "10" });
                const calledUrl = fetchSpy.mock.calls[0][0];
                expect(calledUrl).toBe(
                    "https://api.torn.com/v2/faction?selections=chain&limit=10",
                );
            });

            it("sends the Authorization header", async () => {
                const client = new ApiClient(apiKey);
                await client.get("/faction");
                const calledOptions = fetchSpy.mock.calls[0][1];
                expect(calledOptions.headers).toEqual({
                    Authorization: `ApiKey ${apiKey}`,
                });
            });

            it("returns parsed JSON from the response", async () => {
                const client = new ApiClient(apiKey);
                const result = await client.get("/faction");
                expect(result).toEqual({ data: "result" });
            });

            it("throws an Error with status and statusText on non-ok response", async () => {
                fetchSpy.mockResolvedValue({
                    ok: false,
                    status: 403,
                    statusText: "Forbidden",
                });
                const client = new ApiClient(apiKey);
                await expect(client.get("/faction")).rejects.toThrow("HTTP 403: Forbidden");
            });
        });
    });
});
