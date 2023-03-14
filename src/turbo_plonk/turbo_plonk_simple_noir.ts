import {
  StandardNoirProver,
  StandardNoirVerifier,
  StandardNoirProverConfig,
  StandardNoirVerifierConfig,
} from "../noir_helper";
import { StopgapBarretenbergCachedNoirCircuitSolver } from "./stopgap_cached_noir_circuit_solver";

export const TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG: StandardNoirProverConfig = {
  prepare: async (acir) => {
    // TODO: Build proving key and do lazy wasm loading
  },
  prove: async (acir, intermediateWitness) => {
    throw new Error("Unimplemented");
  },
};

export function createTurboPlonkStandardNoirProver() {
  return new StandardNoirProver(
    TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG,
    new StopgapBarretenbergCachedNoirCircuitSolver()
  );
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
