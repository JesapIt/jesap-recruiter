import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend the necessary Next.js and TypeScript configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add your custom rules here to disable specific ones
  {
    rules: {
      // Disable the 'no-explicit-any' rule
      "@typescript-eslint/no-explicit-any": "off",

      // Disable the 'no-unused-vars' rule for unused variables
      "@typescript-eslint/no-unused-vars": [
        "warn", // or "off" if you want to completely disable it
        { argsIgnorePattern: "^_" }, // Optionally, ignore variables that start with an underscore
      ],
    },
  },
];

export default eslintConfig;
