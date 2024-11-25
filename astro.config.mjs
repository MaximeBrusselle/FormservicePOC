// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind(), react()],

  experimental: {
      env: {
          schema: {
              FORM_SERVICE_URL: envField.string({
                  context: "server",
                  access: "public",
                  startsWith: "https://",
              }),
              CLIENT_ID: envField.string({
                  context: "server",
                  access: "secret",
              }),
              CLIENT_SECRET_BASE64: envField.string({
                  context: "server",
                  access: "secret",
              }),
              TOKEN_URL: envField.string({
                  context: "server",
                  access: "secret",
                  startsWith: "https://",
              }),
          },
      },
  },

  adapter: node({
    mode: "standalone",
  }),
});