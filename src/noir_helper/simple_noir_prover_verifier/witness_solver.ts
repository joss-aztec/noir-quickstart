import {
  InitialWitness,
  IntermediateWitness,
  PublicWitness,
  solveIntermediateWitness,
} from "../../acvm";
import { selectPublicWitness } from "../../acvm/select_public_witness";
import { CompiledNoirCircuit } from "../compiled_noir_circuit";
import { noirCircuitInputToInitialWitness } from "../noir_circuit_input_to_initial_witness";
import {
  NormalisedNoirCircuitParameters,
  NormalisedNoirValue,
  NoirCircuitParameters,
  normaliseNoirCircuitInput,
} from "../noir_circuit_values";
import { selectNoirReturnValue } from "../select_noir_return_value";
import { objDeepEquals } from "./utils";

export class WitnessSolver {
  private prevAcirHash: null | string = null;
  private prevNoirAbiHash: null | string = null;
  private cache: null | {
    normalisedInput: NormalisedNoirCircuitParameters;
    initialWitness: InitialWitness;
    intermediateWitness: IntermediateWitness;
    returnValue: NormalisedNoirValue;
    publicWitness: PublicWitness;
  };

  async solve(circuit: CompiledNoirCircuit, input: NoirCircuitParameters) {
    const normalisedInput = normaliseNoirCircuitInput(input);
    if (
      this.prevAcirHash === circuit.acir.hash &&
      this.prevNoirAbiHash === circuit.noirAbi.hash &&
      this.cache &&
      objDeepEquals(normalisedInput, this.cache.normalisedInput)
    ) {
      return this.cache;
    }

    const initialWitness = await noirCircuitInputToInitialWitness(
      circuit,
      normalisedInput
    );
    const intermediateWitness = await solveIntermediateWitness(
      circuit.acir,
      initialWitness
    );
    const returnValue = await selectNoirReturnValue(
      circuit,
      intermediateWitness
    );
    const publicWitness = await selectPublicWitness(
      circuit.acir,
      intermediateWitness
    );

    this.cache = {
      normalisedInput,
      initialWitness,
      intermediateWitness,
      returnValue,
      publicWitness,
    };

    return this.cache;
  }
}
