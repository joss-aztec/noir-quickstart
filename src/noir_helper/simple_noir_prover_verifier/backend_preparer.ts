import { ACIR } from "../../acvm";

export class BackendPreparer {
  private prevAcirHash: null | string = null;
  private backendPreparationProm: Promise<void> | null;
  constructor(private innerPrepare: (acir: ACIR) => Promise<void>) {}

  async prepare(acir: ACIR) {
    if (!this.backendPreparationProm || this.prevAcirHash !== acir.hash) {
      // Begin preparation for acir if it hasn't begun already
      this.backendPreparationProm = this.innerPrepare(acir);
    }
    await this.backendPreparationProm;
  }
}
