// eslint.config.mjs

import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";



export default [
  {
    ignores: ["out/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "import": importPlugin,
      "prettier": prettierPlugin,
    },
    rules: {
      // Recommended rules from @typescript-eslint/eslint-plugin
      ...typescriptEslintPlugin.configs.recommended.rules,

      // Recommended rules from eslint-plugin-import
      ...importPlugin.configs.recommended.rules,

      // Prettier integration
      "prettier/prettier": "error",

      // Custom rules
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
      ],
      "curly": ["warn", "multi-line"],
      "eqeqeq": ["warn", "always"],
      "no-throw-literal": "warn",
      "semi": "warn",
    },
  },
];
