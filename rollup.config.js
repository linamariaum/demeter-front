import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import { babel } from '@rollup/plugin-babel';

const packageJson = require("./package.json");

export default [
  // Step 1
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({extensions: ['.js', '.ts']}),
      babel({ babelHelpers: 'bundled', extensions: [".js", ".jsx"], }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss(),
    ],
  },
  // Step 2.
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];