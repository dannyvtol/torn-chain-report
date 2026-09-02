import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./no-jsdoc-inline-import.js";

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: "module" } });

describe("no-jsdoc-inline-import", () => {
    it("passes valid code and rejects inline import() in value-bearing tags", () => {
        ruleTester.run("no-jsdoc-inline-import", rule, {
            valid: [
                // @typedef at top — the definition itself is fine
                {
                    code: `
/** @typedef {import("./FactionViewModel.js").FactionViewModel} FactionViewModel */
/** @param {FactionViewModel} viewModel */
function render(viewModel) {}
`,
                },
                // @typedef uses import() to define the alias — allowed
                {
                    code: `
/** @typedef {import("./Store.js").Store} Store */
`,
                },
                // Non-value-bearing tag — not restricted
                {
                    code: `
/** @see {import("./Foo.js").Foo} */
function foo() {}
`,
                },
                // No type expression at all
                {
                    code: `
/** @param viewModel */
function render(viewModel) {}
`,
                },
            ],
            invalid: [
                {
                    code: `
/** @param {import("./FactionViewModel.js").FactionViewModel} viewModel */
function render(viewModel) {}
`,
                    errors: [{ messageId: "inlineImport" }],
                },
                {
                    code: `
/** @type {import("./Store.js").Store} */
const store = null;
`,
                    errors: [{ messageId: "inlineImport" }],
                },
                {
                    code: `
/** @returns {import("./Result.js").Result} */
function compute() {}
`,
                    errors: [{ messageId: "inlineImport" }],
                },
                {
                    code: `
/** @property {import("./Config.js").Config} config */
`,
                    errors: [{ messageId: "inlineImport" }],
                },
            ],
        });
    });
});
