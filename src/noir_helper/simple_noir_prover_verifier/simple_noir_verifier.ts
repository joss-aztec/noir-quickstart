import { BackendPreparer } from "./backend_preparer";

import { SimpleNoirVerifierConfig } from "./simple_noir_prover_verifier_config";
import { ACIR } from "../../acvm";
import { CompiledNoirCircuit } from "../compiled_noir_circuit";
import { NoirCircuitParameters } from "../noir_circuit_values";
import { noirCircuitParametersToPublicWitness } from "../noir_circuit_parameters_to_public_witness";

export class SimpleNoirVerifier {
  private backendPreparer: BackendPreparer;

  constructor(private config: SimpleNoirVerifierConfig) {
    this.backendPreparer = new BackendPreparer(config.prepare);
  }

  async prepare(acir: ACIR) {
    return this.backendPreparer.prepare(acir);
  }

  async verify(
    circuit: CompiledNoirCircuit,
    proof: Uint8Array,
    publicNoirCircuitParameters: NoirCircuitParameters
  ) {
    await this.backendPreparer.prepare(circuit.acir);
    const publicWitness = await noirCircuitParametersToPublicWitness(
      circuit,
      publicNoirCircuitParameters
    );
    return this.config.verify(circuit.acir, proof, publicWitness);
  }
}
