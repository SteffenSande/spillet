// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", {}], // Enable the React Compiler
        ],
      },
    }),
  ],

  vite: {
    server: {
      watch: {
        // Ignore changes in the src/data folder
        ignored: ["**/src/data/**"],
      },
    },

    plugins: [tailwindcss()],
  },
  output: "server",
  prefetch: {
    defaultStrategy: "viewport",
  },
  adapter: node({
    mode: "standalone",
  }),
  server: {
    port: 8000,
    host: "0.0.0.0",
  },
});
