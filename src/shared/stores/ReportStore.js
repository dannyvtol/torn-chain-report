const CACHE_TTL_MS = 30 * 60 * 1000;

/**
 * @typedef {{ chainBreakdown: Record<string, number>, lastInteraction: number }} CachedReport
 */

export class ReportStore {
    /**
     * @returns {Promise<CachedReport | null>}
     */
    async getReport() {
        return globalThis.GM.getValue("report", null);
    }

    /**
     * @param {CachedReport} value
     * @returns {Promise<void>}
     */
    async setReport(value) {
        return globalThis.GM.setValue("report", value);
    }

    /**
     * Returns true when the report exists and its lastInteraction timestamp
     * is less than CACHE_TTL_MS (30 minutes) in the past.
     *
     * @param {CachedReport | null} report
     * @returns {boolean}
     */
    isFresh(report) {
        if (report === null) return false;
        return Date.now() - report.lastInteraction < CACHE_TTL_MS;
    }
}
