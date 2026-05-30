import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png"],
      manifest: {
        name: "HealthBridge Universal",
        short_name: "HealthBridge",
        description: "Comprehensive healthcare management platform",
        theme_color: "#1e40af",
        background_color: "#1e40af",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 300 }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        }
      }
    }
  }
});
