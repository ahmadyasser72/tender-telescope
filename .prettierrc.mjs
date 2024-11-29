// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: false,
  endOfLine: "crlf",

  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-svelte",
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  overrides: [
    { files: "*.astro", options: { parser: "astro" } },
    { files: "*.svelte", options: { parser: "svelte" } },
  ],

  importOrder: [
    "^[.]",
    "",
    "^\\$lib",
    "",
    "^svelte\\/",
    "^astro:?",
    "",
    "<THIRD_PARTY_MODULES>",
  ],
};
