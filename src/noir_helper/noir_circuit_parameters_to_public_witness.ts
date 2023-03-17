import { arrange_public_witness } from "@noir-lang/noir_util_wasm";
import { PublicWitness } from "../acvm";
import { CompiledNoirCircuit } from "./compiled_noir_circuit";
import { NoirCircuitParameters } from "./noir_circuit_values";
import { initNoirUtilWasmProm } from "./noir_util_wasm_init";

// See notes on `PublicWitness` about potential renaming
export async function noirCircuitParametersToPublicWitness(
  circuit: CompiledNoirCircuit,
  parameters: NoirCircuitParameters
): Promise<PublicWitness> {
  const abiJsonStr = JSON.stringify(circuit.noirAbi);
  // The abi expects the return value to be named "return", i.e. not
  // "returnValue" or "return_value".
  const { returnValue, return_value, ...fixedParameters } = parameters;
  fixedParameters["return"] = returnValue ?? return_value;
  const paramsJsonStr = JSON.stringify(fixedParameters);
  await initNoirUtilWasmProm;
  const witnessMap = arrange_public_witness(abiJsonStr, paramsJsonStr);
  return Object.fromEntries(witnessMap.entries());
  // Tests:
  // - Should filter private inputs
  // - Should throw if incomplete
}
