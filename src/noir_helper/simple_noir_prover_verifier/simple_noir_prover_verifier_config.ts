import { ACIR } from "../../acvm";
import { IntermediateWitness, PublicWitness } from "../../acvm";

interface SimpleNoirPreparerConfig {
  // Notifies the backend that user will soon prove/verify for a particular
  // ACIR. This is an opportunity to build proving/verifying keys, and to
  // cancel any resources that are not relevant to the ACIR in question. The
  // implementation should behave as follows:
  // - If the backend is already prepared to prove/verify for the specified
  //   ACIR, the promise should instantly resolve.
  // - If multiple calls are made to prepare in quick succession for the same
  //   ACIR, they should all resolve together.
  // - If a call is made to prepare for a different ACIR before a former call
  //   has resolved, the former call should reject.
  prepare(acir: ACIR): Promise<void>;
  // Worth considering: changing this interface to speak in terms of events,
  // or some more explicit interface that has less subtle implementation
  // requirements.
}

// Subtle bug danger: if there are multiple instances of some config (i.e.
// some cache manager), then the backend state may become out of sync with
// the caches.
export type SimpleNoirProverConfig = SimpleNoirPreparerConfig & {
  prove(
    acir: ACIR,
    intermediateWitness: IntermediateWitness
  ): Promise<Uint8Array>;
};

export type SimpleNoirVerifierConfig = SimpleNoirPreparerConfig & {
  verify(
    acir: ACIR,
    proof: Uint8Array,
    publicWitness: PublicWitness
  ): Promise<boolean>;
};
