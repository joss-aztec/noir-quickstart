import { ACIR } from "./acir";
import { IntermediateWitness, PublicWitness } from "./witnesses";

export async function selectPublicWitness(
  acir: ACIR,
  intermediateWitness: IntermediateWitness
): Promise<PublicWitness> {
  throw new Error("Unimplemented");
}
