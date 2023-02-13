import {
  StandardNoirProver,
  StandardNoirVerifier,
  StandardNoirProverConfig,
  StandardNoirVerifierConfig,
} from "../noir_helper";

export const TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG: StandardNoirProverConfig = {
  prepare: async () => {
    // TODO: Build proving key and do lazy wasm loading
  },
  prove: async (acir, intermediateWitness) => {
    throw new Error("Unimplemented");
  },
};

export function createTurboPlonkStandardNoirProver() {
  return new StandardNoirProver(TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG);
}

export const TURBO_PLONK_SIMPLE_NOIR_VERIFIER_CONFIG: StandardNoirVerifierConfig =
  {
    prepare: async () => {
      // TODO: Build verifying key and do lazy wasm loading
    },
    verify: async (acir, proof, publicWitness) => {
      throw new Error("Unimplemented");
    },
  };

export function createTurboPlonkStandardNoirVerifier() {
  return new StandardNoirVerifier(TURBO_PLONK_SIMPLE_NOIR_VERIFIER_CONFIG);
}
