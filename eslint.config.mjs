import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Prefer as const objects over TypeScript enums
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Use `as const` objects instead of enums. See src/lib/types/index.ts for examples.",
        },
      ],
      // Prefer nullish coalescing over logical or for defaults
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
    },
  },
]);

export default eslintConfig;
