/** @typedef {import("./ApiClient.js").ApiClient} ApiClient */

export const BREAKDOWN_FIELDS = [
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

export class ChainReportService {
    /** @type {ApiClient} */
    #apiClient;

    /** @param {ApiClient} apiClient */
    constructor(apiClient) {
        this.#apiClient = apiClient;
    }

    /**
     * Fetches chain reports for each given chain ID in parallel with the current
     * user profile, filters to the current user's attacker entry per chain, and
     * returns the summed breakdown across all chains.
     *
     * @param {number[]} chainIds
     * @returns {Promise<{ chainBreakdown: Record<string, number> }>}
     */
    async aggregate(chainIds) {
        const [userResult, ...chainResults] = await Promise.allSettled([
            this.#apiClient.get("/user/basic"),
            ...chainIds.map((id) =>
                this.#apiClient.get(`/faction/${id}/chainreport`),
            ),
        ]);

        if (userResult.status === "rejected") {
            throw userResult.reason;
        }

        const userId = userResult.value.profile.id;
        const totals = Object.fromEntries(BREAKDOWN_FIELDS.map((field) => [field, 0]));

        for (const [index, result] of chainResults.entries()) {
            if (result.status === "rejected") {
                console.warn(
                    `Chain report for chain ${chainIds[index]} failed:`,
                    result.reason,
                );
                continue;
            }

            const userEntry = result.value.chainreport.attackers.find(
                (attacker) => attacker.id === userId,
            );

            if (!userEntry) continue;

            for (const field of BREAKDOWN_FIELDS) {
                totals[field] += userEntry.attacks[field];
            }
        }

        return { chainBreakdown: totals };
    }
}
