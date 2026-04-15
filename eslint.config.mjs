import creedengo from "@creedengo/eslint-plugin";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  creedengo.configs.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-irregular-whitespace': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@creedengo/avoid-css-animations': 'off',
      "@creedengo/prefer-shorthand-css-notations": "off",
      "no-empty": "warn",
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
