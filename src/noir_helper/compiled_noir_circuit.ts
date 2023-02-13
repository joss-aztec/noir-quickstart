import { ACIR } from "../acvm";
import { NoirAbi } from "./noir_abi";

export interface CompiledNoirCircuit {
  hash: string;
  acir: ACIR;
  noirAbi: NoirAbi;
}
