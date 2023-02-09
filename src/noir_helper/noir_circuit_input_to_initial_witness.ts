import { InitialWitness } from "../acvm";
import { CompiledNoirCircuit } from "./compiled_noir_circuit";
import { NormalisedNoirCircuitParameters } from "./noir_circuit_values";

export async function noirCircuitInputToInitialWitness(
  circuit: CompiledNoirCircuit,
  input: NormalisedNoirCircuitParameters
): Promise<InitialWitness> {
  throw new Error("Unimplemented");
}
