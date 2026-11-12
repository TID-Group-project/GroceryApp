import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/GroceryApp/",
  resolve: {
    alias: {
      parse: "parse/dist/parse.js", //Forces Vite to use the browser-friendly bundle of Parse to avoid Node.js dependency issues
    },
  },
});
