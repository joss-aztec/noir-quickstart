import { arrange_public_witness } from "@noir-lang/noir_util_wasm";
import { PublicWitness } from "../acvm";
import { CompiledNoirCircuit } from "./compiled_noir_circuit";
import { NoirCircuitParameters } from "./noir_circuit_values";

// See notes on `PublicWitness` about potential renaming
export async function noirCircuitParametersToPublicWitness(
  circuit: CompiledNoirCircuit,
  parameters: NoirCircuitParameters
): Promise<PublicWitness> {
  const abiJsonStr = JSON.stringify(circuit.noirAbi);
  const paramsJsonStr = JSON.stringify(parameters);
  const witnessMap = arrange_public_witness(abiJsonStr, paramsJsonStr);
  return Object.fromEntries(witnessMap.entries());
  // Tests:
  // - Should filter private inputs
  // - Should throw if incomplete
}
