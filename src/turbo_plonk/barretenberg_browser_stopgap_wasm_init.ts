import initBarretenbergBrowserStopgapWasm from "@noir-lang/barretenberg_browser_stopgap_wasm";

// The node variant has no async wasm loader
export const initBarretenbergBrowserStopgapWasmProm =
  typeof initBarretenbergBrowserStopgapWasm === "function"
    ? initBarretenbergBrowserStopgapWasm()
    : Promise.resolve();
