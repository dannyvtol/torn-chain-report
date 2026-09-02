import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import noJsdocInlineImport from "./eslint-local-rules/no-jsdoc-inline-import.js";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: {
            import: importPlugin,
            jsdoc: jsdocPlugin,
            local: { rules: { "no-jsdoc-inline-import": noJsdocInlineImport } },
        },
        languageOptions: { globals: globals.browser },
        rules: {
            "no-console": "warn",
            "id-length": ["error", { min: 3, exceptions: ["id", "i", "j"] }],
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
            "import/no-extraneous-dependencies": "error",
            "local/no-jsdoc-inline-import": "error",
        },
    },
];
