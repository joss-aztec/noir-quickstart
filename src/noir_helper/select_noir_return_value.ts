import { IntermediateWitness } from "../acvm";
import { CompiledNoirCircuit } from "./compiled_noir_circuit";
import { NormalisedNoirValue } from "./noir_circuit_values";

export async function selectNoirReturnValue(
  circuit: CompiledNoirCircuit,
  intermediateWitness: IntermediateWitness
): Promise<NormalisedNoirValue | null> {
  // Note: Not all circuits have a return value, hence the null
  // This function is dependent on the Noir ABI, and possibily also the ACIR
  // ABI -- depending whether or not the Noir ABI knows output witness indices.
  throw new Error("Unimplemented");
}
