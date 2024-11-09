// @ts-check
import { defineConfig } from "astro/config";
import deno from "@astrojs/deno";
import react from "@astrojs/react";

import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  adapter: deno({
    port: 4321,
    hostname: "0.0.0.0",
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
