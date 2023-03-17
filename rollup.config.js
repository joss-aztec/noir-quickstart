const typescript = require("@rollup/plugin-typescript");
const copy = require("rollup-plugin-copy");
const pkg = require("./package.json");

module.exports = [
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [
      typescript(),
      copy({
        targets: [
          {
            src: "node_modules/@noir-lang/barretenberg/esm/wasm/barretenberg.wasm",
            dest: "dist/",
          },
        ],
      }),
    ],
  },
  {
    input: "node_modules/@noir-lang/barretenberg/src/wasm/worker.ts",
    output: [{ file: "dist/worker.js", format: "es" }],
    plugins: [typescript()],
  },
];
