export class AttackViewModel {
    /** @type {Record<string, number> | null} */
    #chainBreakdown = null;

    get chainBreakdown() {
        return this.#chainBreakdown;
    }

    /** @param {Record<string, number> | null} value */
    set chainBreakdown(value) {
        this.#chainBreakdown = value;
    }
}
