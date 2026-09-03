export class SettingsStore {
    /**
     * @returns {Promise<string>}
     */
    async getApiKey() {
        return globalThis.GM.getValue("apiKey", "");
    }

    /**
     * @param {string} value
     * @returns {Promise<void>}
     */
    async setApiKey(value) {
        return globalThis.GM.setValue("apiKey", value);
    }
}
