import { ACIR } from "./acir";
import { InitialWitness, IntermediateWitness } from "./witnesses";

export async function solveIntermediateWitness(
  acir: ACIR,
  initialWitness: InitialWitness
): Promise<IntermediateWitness> {
  // TODO: incorporate blckbox solvers
  throw new Error("Unimplemented");
}
