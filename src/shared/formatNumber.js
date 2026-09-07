const formatter = new Intl.NumberFormat("en-US");

/**
 * Formats a number with locale-aware thousands separators.
 * @param {number} number
 * @returns {string}
 */
export function formatNumber(number) {
    return formatter.format(number);
}
