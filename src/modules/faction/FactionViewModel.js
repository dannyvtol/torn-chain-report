export class FactionViewModel {
    /** @type {string} */
    #apiKey = "";

    /** @type {string} */
    #eventType = "detecting";

    /** @type {number[]} */
    #chainIds = [];

    /** @type {Record<string, number> | null} */
    #attackBreakdown = null;

    get apiKey() {
        return this.#apiKey;
    }

    /** @param {string} value */
    set apiKey(value) {
        this.#apiKey = value;
    }

    get eventType() {
        return this.#eventType;
    }

    /** @param {string} value */
    set eventType(value) {
        this.#eventType = value;
    }

    get chainIds() {
        return this.#chainIds;
    }

    /** @param {number[]} value */
    set chainIds(value) {
        this.#chainIds = value;
    }

    get attackBreakdown() {
        return this.#attackBreakdown;
    }

    /** @param {Record<string, number> | null} value */
    set attackBreakdown(value) {
        this.#attackBreakdown = value;
    }
}
