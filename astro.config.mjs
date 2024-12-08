// @ts-check

import vtbot from "astro-vtbot";
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

  integrations: [
    svelte(),
    tailwind({ applyBaseStyles: false }),
    vtbot({ loadingIndicator: false }),
  ],

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
