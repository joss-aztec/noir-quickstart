import { ACIR } from "../../acvm";
import { IntermediateWitness, PublicWitness } from "../../acvm";

export interface SimpleNoirProverConfig {
  prepare(acir: ACIR): Promise<void>;
  prove(
    acir: ACIR,
    intermediateWitness: IntermediateWitness
  ): Promise<Uint8Array>;
}

export interface SimpleNoirVerifierConfig {
  prepare(acir: ACIR): Promise<void>;
  verify(
    acir: ACIR,
    proof: Uint8Array,
    publicWitness: PublicWitness
  ): Promise<boolean>;
}
