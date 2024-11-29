// @ts-check

import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
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
