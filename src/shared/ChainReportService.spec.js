import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChainReportService } from "./ChainReportService.js";

/** @typedef {import("./ApiClient.js").ApiClient} ApiClient */

const BREAKDOWN_FIELDS = [
    "leave",
    "mug",
    "hospitalize",
    "assists",
    "retaliations",
    "overseas",
    "draws",
    "escapes",
    "losses",
    "war",
    "bonuses",
];

function makeAttackerEntry(userId, overrides = {}) {
    return {
        id: userId,
        respect: { total: 1.0, average: 1.0, best: 1.0 },
        attacks: {
            total: 10,
            leave: 1,
            mug: 1,
            hospitalize: 1,
            assists: 1,
            retaliations: 1,
            overseas: 1,
            draws: 1,
            escapes: 1,
            losses: 1,
            war: 1,
            bonuses: 1,
            ...overrides,
        },
    };
}

function makeChainReportResponse(attackers) {
    return {
        chainreport: {
            id: 1,
            faction_id: 1,
            start: 1000,
            end: 2000,
            details: {},
            bonuses: [],
            attackers,
            non_attackers: [],
        },
    };
}

/**
 * @param {{
 *   userId?: number,
 *   userError?: Error,
 *   chainReports?: Array<object | Error>,
 * }} [options]
 * @returns {ApiClient}
 */
function makeStubApiClient({
    userId = 42,
    userError = undefined,
    chainReports = [],
} = {}) {
    let chainReportIndex = 0;
    return {
        get: vi.fn().mockImplementation((path) => {
            if (path === "/user/basic") {
                if (userError) return Promise.reject(userError);
                return Promise.resolve({ profile: { id: userId } });
            }
            if (path.startsWith("/faction/") && path.endsWith("/chainreport")) {
                const report = chainReports[chainReportIndex++];
                if (report instanceof Error) return Promise.reject(report);
                return Promise.resolve(report);
            }
            return Promise.reject(new Error(`Unexpected path: ${path}`));
        }),
    };
}

describe("ChainReportService", () => {
    beforeEach(() => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    describe("aggregate()", () => {
        it("returns a chainBreakdown with all 11 fields zeroed when chainIds is empty", async () => {
            const apiClient = makeStubApiClient();
            const service = new ChainReportService(apiClient);
            const result = await service.aggregate([]);
            const expectedBreakdown = Object.fromEntries(
                BREAKDOWN_FIELDS.map((field) => [field, 0]),
            );
            expect(result).toEqual({ chainBreakdown: expectedBreakdown });
        });

        it("sums all 11 attack fields for the current user across chains", async () => {
            const userId = 42;
            const apiClient = makeStubApiClient({
                userId,
                chainReports: [
                    makeChainReportResponse([makeAttackerEntry(userId)]),
                    makeChainReportResponse([makeAttackerEntry(userId)]),
                ],
            });
            const service = new ChainReportService(apiClient);
            const result = await service.aggregate([101, 102]);
            const expectedBreakdown = Object.fromEntries(
                BREAKDOWN_FIELDS.map((field) => [field, 2]),
            );
            expect(result).toEqual({ chainBreakdown: expectedBreakdown });
        });

        it("excludes attacks.total from the breakdown", async () => {
            const userId = 42;
            const apiClient = makeStubApiClient({
                userId,
                chainReports: [
                    makeChainReportResponse([
                        makeAttackerEntry(userId, { total: 99 }),
                    ]),
                ],
            });
            const service = new ChainReportService(apiClient);
            const result = await service.aggregate([101]);
            expect(result.chainBreakdown).not.toHaveProperty("total");
        });

        it("contributes zeros when user is absent from a chain", async () => {
            const userId = 42;
            const otherUserId = 99;
            const apiClient = makeStubApiClient({
                userId,
                chainReports: [
                    makeChainReportResponse([makeAttackerEntry(otherUserId)]),
                ],
            });
            const service = new ChainReportService(apiClient);
            const result = await service.aggregate([101]);
            const expectedBreakdown = Object.fromEntries(
                BREAKDOWN_FIELDS.map((field) => [field, 0]),
            );
            expect(result).toEqual({ chainBreakdown: expectedBreakdown });
        });

        it("skips a failed chain report and emits console.warn", async () => {
            const userId = 42;
            const chainError = new Error("HTTP 503");
            const apiClient = makeStubApiClient({
                userId,
                chainReports: [
                    chainError,
                    makeChainReportResponse([makeAttackerEntry(userId)]),
                ],
            });
            const service = new ChainReportService(apiClient);
            const result = await service.aggregate([101, 102]);
            const expectedBreakdown = Object.fromEntries(
                BREAKDOWN_FIELDS.map((field) => [field, 1]),
            );
            expect(result).toEqual({ chainBreakdown: expectedBreakdown });
            expect(console.warn).toHaveBeenCalledOnce();
        });

        it("throws when /user/basic fails", async () => {
            const userError = new Error("HTTP 401");
            const apiClient = makeStubApiClient({ userError });
            const service = new ChainReportService(apiClient);
            await expect(service.aggregate([101])).rejects.toThrow("HTTP 401");
        });

        it("fetches /user/basic and all chain reports simultaneously", async () => {
            const userId = 42;
            const callOrder = [];
            const apiClient = {
                get: vi.fn().mockImplementation((path) => {
                    callOrder.push(path);
                    if (path === "/user/basic")
                        return Promise.resolve({ profile: { id: userId } });
                    return Promise.resolve(
                        makeChainReportResponse([makeAttackerEntry(userId)]),
                    );
                }),
            };
            const service = new ChainReportService(apiClient);
            await service.aggregate([101, 102]);
            // All three paths must be requested before any resolves (i.e., called in
            // the same tick via Promise.all / Promise.allSettled)
            expect(apiClient.get).toHaveBeenCalledTimes(3);
            expect(callOrder).toContain("/user/basic");
            expect(callOrder).toContain("/faction/101/chainreport");
            expect(callOrder).toContain("/faction/102/chainreport");
        });
    });
});
