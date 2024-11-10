// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone"
  }),
  output: "server",
  experimental: {
    serverIslands: true,
  },

  integrations: [
    react(),
    svelte(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});