import { IntermediateWitness } from "../acvm";
import { CompiledNoirCircuit } from "./compiled_noir_circuit";
import { NormalisedNoirValue } from "./noir_circuit_values";

export async function selectNoirReturnValue(
  circuit: CompiledNoirCircuit,
  intermediateWitness: IntermediateWitness
): Promise<NormalisedNoirValue> {
  throw new Error("Unimplemented");
}
