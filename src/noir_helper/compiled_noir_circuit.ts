import { ACIR } from "../acvm";
import { NoirAbi } from "./noir_abi";

export interface CompiledNoirCircuit {
  acir: ACIR;
  noirAbi: NoirAbi;
}
