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
    // Files outside tsconfig — typed lint rules crash on these
    "*.mjs",
    "scripts/**",
    "prisma/**",
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
    },
  },
  // Note: @typescript-eslint/prefer-nullish-coalescing removed — requires
  // parserOptions.project for typed linting, which eslint-config-next doesn't configure.
]);

export default eslintConfig;
