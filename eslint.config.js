import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { import: importPlugin },
        languageOptions: { globals: globals.browser },
        rules: {
            "no-console": "warn",
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
        },
    },
];
