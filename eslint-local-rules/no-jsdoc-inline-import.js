/**
 * ESLint rule: ban inline import() in JSDoc value-bearing tag type expressions.
 * Use @typedef at the top of the file instead.
 *
 * Restricted tags: @param, @type, @returns, @property
 * (@typedef is allowed to use import() — that is how the alias is defined.)
 */

/** @typedef {import("eslint").Rule.RuleModule} RuleModule */

const RESTRICTED_TAGS = new Set(["param", "type", "returns", "property"]);

/** Matches a JSDoc tag followed by an optional brace-enclosed type expression. */
const TAG_WITH_TYPE_PATTERN = /@(\w+)\s*\{([^}]*)\}/g;

/** Matches inline import() inside a type expression. */
const INLINE_IMPORT_PATTERN = /\bimport\s*\(/;

/** @type {RuleModule} */
export default {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "Require @typedef at top of file instead of inline import() in JSDoc value-bearing tag type expressions.",
        },
        schema: [],
        messages: {
            inlineImport:
                "Use @typedef at top of file instead of inline import() in @{{tag}}.",
        },
    },
    create(context) {
        const sourceCode = context.sourceCode;

        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    if (comment.type !== "Block" || !comment.value.startsWith("*")) {
                        continue;
                    }

                    TAG_WITH_TYPE_PATTERN.lastIndex = 0;
                    let match;
                    while ((match = TAG_WITH_TYPE_PATTERN.exec(comment.value)) !== null) {
                        const [, tag, typeExpression] = match;
                        if (!RESTRICTED_TAGS.has(tag)) continue;
                        if (INLINE_IMPORT_PATTERN.test(typeExpression)) {
                            context.report({
                                loc: comment.loc,
                                messageId: "inlineImport",
                                data: { tag },
                            });
                        }
                    }
                }
            },
        };
    },
};
