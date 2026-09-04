export class ReportStore {
    /**
     * @returns {Promise<{ chainBreakdown: Record<string, number> } | null>}
     */
    async getReport() {
        return globalThis.GM.getValue("report", null);
    }

    /**
     * @param {{ chainBreakdown: Record<string, number> }} value
     * @returns {Promise<void>}
     */
    async setReport(value) {
        return globalThis.GM.setValue("report", value);
    }
}
