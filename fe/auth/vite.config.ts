import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const host =
    env.VITE_API_DOMAIN_NAME && env.VITE_API_DOMAIN_COMMON
      ? `${env.VITE_API_DOMAIN_NAME}.${env.VITE_API_DOMAIN_COMMON}`
      : "localhost";

  const port = env.VITE_API_PORT ? parseInt(env.VITE_API_PORT) : 3001;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host,
      port,
      https: {
        key: readFileSync(join(__dirname, ".", "cert", `${host}-key.pem`)),
        cert: readFileSync(join(__dirname, ".", "cert", `${host}.pem`)),
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
