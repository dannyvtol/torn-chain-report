export class SettingsStore {
    /**
     * @returns {Promise<string>}
     */
    async getApiKey() {
        return GM.getValue("apiKey", "");
    }

    /**
     * @param {string} value
     * @returns {Promise<void>}
     */
    async setApiKey(value) {
        return GM.setValue("apiKey", value);
    }
}
