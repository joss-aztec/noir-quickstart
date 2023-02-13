import { InitialWitness } from "../acvm";
import { CompiledNoirCircuit } from "./compiled_noir_circuit";
import { NormalisedNoirCircuitParameters } from "./noir_circuit_values";

export async function noirCircuitInputToInitialWitness(
  circuit: CompiledNoirCircuit,
  input: NormalisedNoirCircuitParameters
): Promise<InitialWitness> {
  // It's not yet clear if this method will be dependent on both the Noir ABI
  // and the ACIR ABI. (See https://github.com/noir-lang/noir/issues/684.) If
  // only the Noir ABI is required, this function needn't take the whole
  // compiled circuit as input.
  throw new Error("Unimplemented");
}
