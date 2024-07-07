import globals from "globals";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs,ts}"]
  },
  {
    ignores: [
      "**/node_modules/**",
      "src/test/**",
      "**/*.spec.js",
      "**/webpack.config.js",
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.webextensions,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.all,
  {
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "sort-keys": ["error", "asc", { "minKeys": 10 }],
      "object-curly-newline": ["error", {
        "ImportDeclaration": { "multiline": true }
      }],
      "no-console": "error",
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/strict-boolean-expressions": "warn",
    },
  }
);
