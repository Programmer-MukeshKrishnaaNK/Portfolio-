import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next v15 ships eslintrc-style configs, not flat-config
// arrays, so they have to come through FlatCompat. (create-next-app wrote the
// v16 form, which imports them as flat arrays and fails against the pinned
// Next 15.)
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
