import initAztecBackend from "@noir-lang/aztec_backend";

// The node variant has no async wasm loader
export const initAztecBackendProm =
  typeof initAztecBackend === "function"
    ? initAztecBackend()
    : Promise.resolve();
