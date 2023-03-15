const typescript = require("@rollup/plugin-typescript");
const pkg = require("./package.json");

module.exports = [
  {
    input: "src/index.ts",
    output: {
      name: "@noir-lang/quickstart",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      typescript(),
    ],
  },
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [typescript()],
  },
];
