// @ts-check

import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "static",
  redirects: {
    "/": "/start",
  },

  integrations: [svelte(), tailwind({ applyBaseStyles: false })],

  env: {
    schema: {
      PIXABAY_API_KEY: {
        access: "secret",
        context: "server",
        type: "string",
      },
      VOICE_RSS_API_KEY: {
        access: "secret",
        context: "server",
        type: "string",
      },
    },
  },

  legacy: {
    collections: true,
  },
});
