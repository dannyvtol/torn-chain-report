export class MissingApiKey extends Error {
    constructor() {
        super("API key is missing or empty.");
    }
}
