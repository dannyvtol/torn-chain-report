import { MissingApiKey } from "./MissingApiKey.js";

export class ApiClient {
    #apiKey;

    /** @param {string | null} apiKey */
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }

    /**
     * @param {string} path
     * @param {Record<string, string>} [params]
     * @returns {Promise<unknown>}
     */
    async get(path, params = {}) {
        if (this.#apiKey === null || this.#apiKey === "") {
            throw new MissingApiKey();
        }

        const url = new URL(`https://api.torn.com/v2${path}`);
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }

        const response = await fetch(url.toString(), {
            headers: { Authorization: `ApiKey ${this.#apiKey}` },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }
}
