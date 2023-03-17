import { solve_intermediate_witness } from "@noir-lang/barretenberg_browser_stopgap_wasm";
import {
  arrange_initial_witness,
  select_public_witness,
  select_return_value,
} from "@noir-lang/noir_util_wasm";
import {
  CachedNoirCircuitSolver,
  CompiledNoirCircuit,
  NoirCircuitSolution,
} from "../noir_helper";
import {
  NoirCircuitParameters,
  normaliseNoirCircuitInput,
} from "../noir_helper/noir_circuit_values";
import { initNoirUtilWasmProm } from "../noir_helper/noir_util_wasm_init";
import { objDeepEquals } from "../noir_helper/standard_noir_prover_verifier/utils";
import { initBarretenbergBrowserStopgapWasmProm } from "./barretenberg_browser_stopgap_wasm_init";

export class StopgapBarretenbergCachedNoirCircuitSolver
  implements CachedNoirCircuitSolver
{
  private cache: null | NoirCircuitSolution;

  async solve(circuit: CompiledNoirCircuit, input: NoirCircuitParameters) {
    const normalisedInput = normaliseNoirCircuitInput(input);
    if (
      this.cache?.circuitHash === circuit.hash &&
      objDeepEquals(normalisedInput, this.cache.normalisedInput)
    ) {
      return this.cache;
    }
    const abiJsonStr = JSON.stringify(circuit.noirAbi);
    const inputJsonStr = JSON.stringify(input);
    await initNoirUtilWasmProm;
    const initialWitness = arrange_initial_witness(abiJsonStr, inputJsonStr);
    await initBarretenbergBrowserStopgapWasmProm;
    const intermediateWitness = solve_intermediate_witness(
      circuit.acir,
      initialWitness
    );
    const returnValueMapJsonStr = select_return_value(
      abiJsonStr,
      intermediateWitness
    );
    const returnMapValue = JSON.parse(returnValueMapJsonStr);
    const returnValue = returnMapValue?.return ?? null;
    const publicWitness = select_public_witness(
      circuit.acir,
      intermediateWitness
    );

    this.cache = {
      circuitHash: circuit.hash,
      normalisedInput,
      initialWitness: Object.fromEntries(initialWitness.entries()),
      intermediateWitness: Object.fromEntries(intermediateWitness.entries()),
      returnValue,
      publicWitness: Object.fromEntries(publicWitness.entries()),
    };

    return this.cache;
  }
}
