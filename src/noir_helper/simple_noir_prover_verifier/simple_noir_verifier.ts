import { SimpleNoirVerifierConfig } from "./simple_noir_prover_verifier_config";
import { ACIR } from "../../acvm";
import { CompiledNoirCircuit } from "../compiled_noir_circuit";
import { NoirCircuitParameters } from "../noir_circuit_values";
import { noirCircuitParametersToPublicWitness } from "../noir_circuit_parameters_to_public_witness";

export class SimpleNoirVerifier {
  constructor(private config: SimpleNoirVerifierConfig) {}

  async prepare(acir: ACIR) {
    return this.config.prepare(acir);
  }

  async verify(
    circuit: CompiledNoirCircuit,
    proof: Uint8Array,
    publicNoirCircuitParameters: NoirCircuitParameters
  ) {
    await this.config.prepare(circuit.acir);
    const publicWitness = await noirCircuitParametersToPublicWitness(
      circuit,
      publicNoirCircuitParameters
    );
    return this.config.verify(circuit.acir, proof, publicWitness);
  }
}
