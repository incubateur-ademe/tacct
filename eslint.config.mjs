import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  {
    files: ["**/*.config.{js,mjs,cjs}", "copy-assets.js"],
    languageOptions: { globals: globals.node }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-irregular-whitespace': 'off',
      'react/no-unescaped-entities': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
