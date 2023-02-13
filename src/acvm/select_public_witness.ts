import { ACIR } from "./acir";
import { IntermediateWitness, PublicWitness } from "./witnesses";

// This function is convenient when wanting to submit/share a proof because it
// allows the user to collate public parameters without requiring knowledge of
// the circuit's DSL specific ABI.
// See notes on `PublicWitness` about potential renaming.
export async function selectPublicWitness(
  acir: ACIR,
  intermediateWitness: IntermediateWitness
): Promise<PublicWitness> {
  throw new Error("Unimplemented");
}
