import { BackendPreparer } from "./backend_preparer";

import { SimpleNoirVerifierConfig } from "./simple_noir_prover_verifier_config";
import { ACIR, PublicWitness } from "../../acvm";

export class SimpleNoirVerifier {
  private backendPreparer: BackendPreparer;

  constructor(private config: SimpleNoirVerifierConfig) {
    this.backendPreparer = new BackendPreparer(config.prepare);
  }

  async prepare(acir: ACIR) {
    return this.backendPreparer.prepare(acir);
  }

  async verify(acir: ACIR, proof: Uint8Array, publicWitness: PublicWitness) {
    await this.backendPreparer.prepare(acir);
    return this.config.verify(acir, proof, publicWitness);
  }
}
