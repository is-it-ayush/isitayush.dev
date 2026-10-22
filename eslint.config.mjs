import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.next/**', '.velite/**', 'next-env.d.ts', 'public/**'] },
  ...nextCoreWebVitals,
  ...tseslint.configs.recommended,
  {
    rules: {
      // borrowing rules from [typehero/tooling/config-eslint/utils/rules.js](https://github.com/typehero/typehero/blob/main/tooling/config-eslint/utils/rules.js)
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/sort-type-constituents': 'warn',
      'no-floating-decimal': 'warn',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { disallowTypeAnnotations: false },
      ],
      // Rules below here can be re-enabled when the team wants to address them.
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-await-in-loop': 'off',
      'no-param-reassign': 'off',
      'no-constant-binary-expression': 'off',
      'react/no-array-index-key': 'off',
      'react/no-unstable-nested-components': 'off',
      eqeqeq: 'off',
      'no-control-regex': 'off',
      'no-nested-ternary': 'off',
      'no-console': 'off',
      'jsx-a11y/html-has-lang': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
    },
  },
);
