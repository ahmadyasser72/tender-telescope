// @ts-check

import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  output: "server",
  redirects: {
    "/": "/start",
  },

  integrations: [svelte(), tailwind({ applyBaseStyles: false })],

  experimental: {
    env: {
      schema: {
        PIXABAY_API_KEY: {
          access: "secret",
          context: "server",
          type: "string",
        },
      },
    },
  },
});
