import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative asset URLs so the build works at a sub-path (GitHub Pages) as well as at a domain root.
  base: "./",
  plugins: [react(), tailwindcss()],
});
