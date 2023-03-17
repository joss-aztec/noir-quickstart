import initNoirUtilWasm from "@noir-lang/noir_util_wasm";

// The node variant has no async wasm loader
export const initNoirUtilWasmProm =
  typeof initNoirUtilWasm === "function"
    ? initNoirUtilWasm()
    : Promise.resolve();
