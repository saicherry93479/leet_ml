// @ts-check
import { defineConfig } from "astro/config";
import deno from "@astrojs/deno";
import react from "@astrojs/react";

import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";
import vercelServerless from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  adapter: vercelServerless(),
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
