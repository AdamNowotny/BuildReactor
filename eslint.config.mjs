import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

// eslint-disable-next-line @typescript-eslint/no-deprecated
export default tseslint.config(
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    },
    {
        ignores: [
            '**/node_modules/**',
            'src/test/**',
            'dist/**',
            '**/*.spec.js',
            '**/webpack.config.js',
            'vite.config.mts',
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.webextensions,
                ...globals.browser,
            },
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    reactPlugin.configs.flat.recommended,
    {
        rules: {
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-misused-promises': [
                'error',
                { checksVoidReturn: false },
            ],
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            '@typescript-eslint/restrict-template-expressions': 'off',
            'no-console': 'error',
            'object-curly-newline': [
                'error',
                {
                    ImportDeclaration: { multiline: true },
                },
            ],
            'object-shorthand': ['error', 'always'],
            'prefer-arrow-callback': 'error',
            'react/display-name': 'off',
            'sort-keys': ['error', 'asc', { minKeys: 10 }],
        },
    },
);
