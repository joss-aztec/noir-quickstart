import {
  SimpleNoirProver,
  SimpleNoirVerifier,
  SimpleNoirProverConfig,
  SimpleNoirVerifierConfig,
} from "../noir_helper";

export const TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG: SimpleNoirProverConfig = {
  prepare: async () => {
    // TODO: Build proving key and do lazy wasm loading
  },
  prove: async (acir, intermediateWitness) => {
    throw new Error("Unimplemented");
  },
};

export function createTurboPlonkSimpleNoirProver() {
  return new SimpleNoirProver(TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG);
}

export const TURBO_PLONK_SIMPLE_NOIR_VERIFIER_CONFIG: SimpleNoirVerifierConfig =
  {
    prepare: async () => {
      // TODO: Build verifying key and do lazy wasm loading
    },
    verify: async (acir, proof, publicWitness) => {
      throw new Error("Unimplemented");
    },
  };

export function createTurboPlonkSimpleNoirVerifier() {
  return new SimpleNoirVerifier(TURBO_PLONK_SIMPLE_NOIR_VERIFIER_CONFIG);
}
