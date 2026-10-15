import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", "dist/**", "distTests/**", "docs/**", "coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.mjs"],
    languageOptions: {
      globals: { process: "readonly", console: "readonly", Buffer: "readonly", setTimeout: "readonly", clearTimeout: "readonly", URL: "readonly", fetch: "readonly" },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["src/**/*.ts", "tests/**/*.ts", "scripts/**/*.mjs"],
    plugins: { local: { rules: {
      noComments: { create: (context) => ({ Program: () => {
        for (const comment of context.sourceCode.getAllComments()) {
          context.report({ loc: comment.loc, message: "Code comments are not allowed in this project." });
        }
      } }) },
    } } },
    rules: { "local/noComments": "error" },
  },
);
