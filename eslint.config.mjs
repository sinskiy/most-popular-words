import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.browser, sourceType: "module" },
  },
  {
    files: ["*.config.js"],
    languageOptions: { globals: globals.node, sourceType: "commonjs" },
  },
  pluginJs.configs.recommended,
];
