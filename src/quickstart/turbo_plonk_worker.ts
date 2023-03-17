import { expose } from "comlink";
import type { StandardNoirProver } from "../noir_helper";
import {
  createTurboPlonkStandardNoirProver,
  createTurboPlonkStandardNoirVerifier,
} from "../turbo_plonk";

const prover = createTurboPlonkStandardNoirProver();
const verifier = createTurboPlonkStandardNoirVerifier();

export type INoirProver = Pick<
  StandardNoirProver,
  "prepare" | "solve" | "prove"
>;

export type INoirVerifier = Pick<typeof verifier, "prepare" | "verify">;

const workerExports: INoirProver & INoirVerifier = {
  prepare: (acir) => prover.prepare(acir),
  solve: (circuit, input) => prover.solve(circuit, input),
  prove: (circuit, input) => prover.prove(circuit, input),
  verify: (circuit, proof, params) => verifier.verify(circuit, proof, params),
};
expose(workerExports);
