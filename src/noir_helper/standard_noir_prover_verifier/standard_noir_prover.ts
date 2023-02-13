import { CompiledNoirCircuit } from "../compiled_noir_circuit";
import { NoirCircuitParameters } from "../noir_circuit_values";
import { StandardNoirProverConfig } from "./standard_noir_prover_verifier_config";
import { CachedNoirCircuitSolver } from "./cached_noir_circuit_solver";
import { ACIR } from "../../acvm";

export class StandardNoirProver {
  private solver = new CachedNoirCircuitSolver();
  constructor(private config: StandardNoirProverConfig) {}

  async solve(circuit: CompiledNoirCircuit, input: NoirCircuitParameters) {
    const { returnValue } = await this.solver.solve(circuit, input);
    return returnValue;
  }

  async prepare(acir: ACIR) {
    return this.config.prepare(acir);
  }

  async prove(circuit: CompiledNoirCircuit, input: NoirCircuitParameters) {
    // Might as well prepare in parallel
    const prepareProm = this.config.prepare(circuit.acir);
    // Note that the class below avoids repeating unnecessary work, so it's
    // fine to call solve & prove in any order.
    const { intermediateWitness, returnValue, publicWitness } =
      await this.solver.solve(circuit, input);
    await prepareProm;
    const proof = await this.config.prove(circuit.acir, intermediateWitness);
    return { proof, returnValue, publicWitness };
  }
}
