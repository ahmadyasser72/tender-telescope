// @ts-check

import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "static",
  // adapter: node({
  //   mode: "standalone",
  // }),

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
      GITHUB_REPOSITORY: {
        access: "public",
        context: "client",
        type: "string",
        optional: true,
      },
      UPSTASH_REDIS_REST_URL: {
        access: "secret",
        context: "server",
        type: "string",
        optional: true,
      },
      UPSTASH_REDIS_REST_TOKEN: {
        access: "secret",
        context: "server",
        type: "string",
        optional: true,
      },
    },
  },

  legacy: {
    collections: true,
  },
});
