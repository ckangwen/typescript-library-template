import path from "path";
import rimraf from "rimraf";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import esbuild, { minify } from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

const commonPlugins = [
  esbuild({
    target: "es2015",
  }),
  nodeResolve(),
  commonJs(),
];

const input = path.resolve(__dirname, "./src/index.ts");
const getOutput = (filename) => path.resolve(__dirname, "./dist", filename);

const config = [
  {
    input,
    output: {
      file: getOutput("index.cjs.js"),
      format: "cjs",
      globals: {
        "vue-demi": "VueDemi",
      },
    },
    external(id) {
      return /^vue/.test(id);
    },
    plugins: commonPlugins,
  },
  {
    input,
    output: {
      file: getOutput("index.es.js"),
      format: "es",
      globals: {
        "vue-demi": "VueDemi",
      },
    },
    external(id) {
      return /^vue/.test(id);
    },
    plugins: commonPlugins,
  },
  {
    input,
    output: {
      file: getOutput("index.iife.min.js"),
      name: "CharrueComposable",
      format: "iife",
      extend: true,

      globals: {
        "vue-demi": "VueDemi",
      },
    },
    external(id) {
      return /^vue/.test(id);
    },
    plugins: [...commonPlugins, minify()],
  },
  {
    input: "src/index.ts",
    output: [
      {
        format: "es",
        file: getOutput("index.d.ts"),
      },
    ],
    plugins: [dts()],
  },
];

rimraf.sync("./dist");
export default config;
