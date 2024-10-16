import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import deno from "@astrojs/deno";



// https://astro.build/config
export default defineConfig({
  adapter: deno({
    port: 4321,
    hostname: "0.0.0.0",
  }),
  output: "server",
  devToolbar: {
    enabled: false,
  },
  experimental: {
    serverIslands: true,
  },
  integrations: [svelte(), tailwind({
    applyBaseStyles: false,
  })],
});