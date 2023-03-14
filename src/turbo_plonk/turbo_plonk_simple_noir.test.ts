import { createHash } from "crypto";
import { StandardNoirProver, StandardNoirVerifier } from "../noir_helper";
import { CompiledNoirCircuit } from "../noir_helper/compiled_noir_circuit";
import {
  createTurboPlonkStandardNoirProver,
  createTurboPlonkStandardNoirVerifier,
} from "./turbo_plonk_simple_noir";

let muteConsoleError = false;
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  error: (...args) => {
    if (muteConsoleError) return;
    return originalConsole.error(...args);
  },
};

async function loadCircuit(name: string) {
  const build = require(`../../test_resources/${name}/target/${name}.json`);
  const acirBuffer = Uint8Array.from(build.circuit);
  const acirHash = createHash("sha256").update(acirBuffer).digest("hex");
  const noirAbi = build.abi;
  const circuit: CompiledNoirCircuit = {
    hash: acirHash,
    acir: acirBuffer,
    noirAbi,
  };
  return circuit;
}

describe("Turbo PLONK simple noir helpers", () => {
  let prover: StandardNoirProver;
  let verifier: StandardNoirVerifier;
  let circuit1: CompiledNoirCircuit;
  const PEDERSEN_456_X =
    "0x2c074f65ad3f08075ccfdb634f6efecc935b6dd19bbd2e3b68177267a9cb3aff";
  let circuit2: CompiledNoirCircuit;

  beforeAll(async () => {
    prover = createTurboPlonkStandardNoirProver();
    verifier = createTurboPlonkStandardNoirVerifier();

    circuit1 = await loadCircuit("circuit1");
    // For reference - circuit1/src/main.nr:
    // fn main(x : Field, y : pub Field) -> pub Field {
    //     constrain x != y;
    //     std::hash::pedersen([x])[0]
    // }

    circuit2 = await loadCircuit("circuit2");
    // For reference - circuit2/src/main.nr:
    // fn main(x : Field, some_list : pub [Field; 2]) {
    //     for i in 0..2 {
    //         constrain x != some_list[i];
    //     }
    // }
  });

  describe("Prover", () => {
    it("can solve a valid circuit and inputs", async () => {
      const input = { x: "123", y: 456 };
      const returnValue = await prover.solve(circuit1, input);
      const expectedReturnValue = PEDERSEN_456_X;
      expect(returnValue).toBe(expectedReturnValue);
    });

    it("throws when solving an invalid circuit input", async () => {
      const input = { x: 123, y: 123 };
      muteConsoleError = true;
      const prom = prover.solve(circuit1, input);
      await expect(prom).rejects.toBeDefined();
      muteConsoleError = false;
    });

    it("proves a valid circuit and inputs", async () => {
      const input = { x: 123, y: 456 };
      const { proof, returnValue } = await prover.prove(circuit1, input);
      expect(proof).toBeDefined();
      expect(returnValue).toBe(PEDERSEN_456_X);
    });

    it("new backend tasks interupt unfinshed ones", async () => {
      // I.e. only the most current instruction to the backend should be
      // honoured. Interrupted preparations and proving should throw.

      const input1 = { x: "123", y: "456" };
      const input2 = { x: 1, some_list: [2, 3] };

      const prepare1Prom = prover.prepare(circuit1.acir);
      // Start preparation of circuit2 before circuit1's finishes
      await prover.prepare(circuit2.acir);
      expect(prepare1Prom).rejects.toBeDefined();

      const provingResult2Prom = prover.prove(circuit2, input2);
      // Start proving (and preparation) of circuit1 before circuit2's finishes
      await prover.prove(circuit1, input1);
      expect(provingResult2Prom).rejects.toBeDefined();
    });
  });

  describe("Verifier", () => {
    it("verifies a valid proof", async () => {
      const input = { x: 123, y: 456 };
      const { proof, returnValue } = await prover.prove(circuit1, input);
      const publicParameters = { y: input.y, return_value: returnValue };
      const isValid = await verifier.verify(circuit1, proof, publicParameters);
      expect(isValid).toBe(true);
    });

    it("rejects an invalid proof", async () => {
      const publicParameters = { y: 456, return_value: PEDERSEN_456_X };
      const proofSize = 2368;
      const badProof = new Uint8Array(proofSize);
      const isValid = await verifier.verify(
        circuit1,
        badProof,
        publicParameters
      );
      expect(isValid).toBe(false);
    });
  });
});
