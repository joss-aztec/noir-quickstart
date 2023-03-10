import { PublicWitness } from "../acvm";
import { CompiledNoirCircuit } from "./compiled_noir_circuit";
import { NoirCircuitParameters } from "./noir_circuit_values";

// See notes on `PublicWitness` about potential renaming
export async function noirCircuitParametersToPublicWitness(
  circuit: CompiledNoirCircuit,
  parameters: NoirCircuitParameters
): Promise<PublicWitness> {
  throw new Error("Unimplemented");
  // Tests:
  // - Should filter private inputs
  // - Should throw if incomplete
}
