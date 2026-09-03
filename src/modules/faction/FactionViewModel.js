export class FactionViewModel {
    /** @type {string} */
    #apiKey = "";

    get apiKey() {
        return this.#apiKey;
    }

    /** @param {string} value */
    set apiKey(value) {
        this.#apiKey = value;
    }
}
