import { BackendPreparer } from "./backend_preparer";
import { CompiledNoirCircuit } from "../compiled_noir_circuit";
import { NoirCircuitParameters } from "../noir_circuit_values";
import { SimpleNoirProverConfig } from "./simple_noir_prover_verifier_config";
import { WitnessSolver } from "./witness_solver";
import { ACIR } from "../../acvm";

export class SimpleNoirProver {
  private witnessSolver: WitnessSolver;
  private backendPreparer: BackendPreparer;

  constructor(private config: SimpleNoirProverConfig) {
    this.witnessSolver = new WitnessSolver();
    this.backendPreparer = new BackendPreparer(config.prepare);
  }

  async solve(circuit: CompiledNoirCircuit, input: NoirCircuitParameters) {
    const { returnValue } = await this.witnessSolver.solve(circuit, input);
    return returnValue;
  }

  async prepare(acir: ACIR) {
    return this.backendPreparer.prepare(acir);
  }

  async prove(circuit: CompiledNoirCircuit, input: NoirCircuitParameters) {
    // Might as well prepare in parallel
    const prepareProm = this.backendPreparer.prepare(circuit.acir);
    // Note that the classes below avoid repeating unnecessary work, so it's
    // fine to call prepare, solve & prove in any order.
    const { intermediateWitness, returnValue, publicWitness } =
      await this.witnessSolver.solve(circuit, input);
    await prepareProm;
    const proof = await this.config.prove(circuit.acir, intermediateWitness);
    return { proof, returnValue, publicWitness };
  }
}
