#! /bin/bash

npx swc src --config-file node-cjs.swcrc --ignore "*.test.ts" --out-dir dist/cjs
npx swc src --config-file web-esm.swcrc --ignore "*.test.ts" --out-dir dist/esm
