import {
  StandardNoirProver,
  StandardNoirVerifier,
  StandardNoirProverConfig,
  StandardNoirVerifierConfig,
} from "../noir_helper";
import { StopgapBarretenbergCachedNoirCircuitSolver } from "./stopgap_cached_noir_circuit_solver";
import {
  BarretenbergWasm,
  getCircuitSize,
  PooledPippenger,
  PooledFft,
  Prover,
  StandardExampleProver,
  StandardExampleVerifier,
} from "@noir-lang/barretenberg";
import { Crs } from "@noir-lang/barretenberg/dest/crs";
import { WorkerPool } from "@noir-lang/barretenberg/dest/wasm";

import { ACIR, IntermediateWitness, PublicWitness } from "../acvm";
import {
  acir_to_constraints_system,
  intermediate_witness_to_assignment_bytes,
} from "@noir-lang/barretenberg_browser_stopgap_wasm";

async function load_crs(circSize: number) {
  // We may need more elements in the SRS than the circuit size. In particular, we may need circSize +1
  // We add an offset here to account for that
  const offset = 1;

  const crs = new Crs(circSize + offset);
  await crs.download();

  return crs;
}

export async function setup_generic_prover_and_verifier(acir: Uint8Array) {
  const barretenberg = await BarretenbergWasm.new();

  const serialised_circuit = acir_to_constraints_system(acir);
  const circSize = await getCircuitSize(barretenberg, serialised_circuit);

  const crs = await load_crs(circSize);

  const numWorkers = 4; //getNumCores();

  const wasm = await BarretenbergWasm.new();
  const workerPool = await WorkerPool.new(wasm, numWorkers);
  const pippenger = new PooledPippenger(workerPool);

  const fft = new PooledFft(workerPool);
  await fft.init(circSize);

  await pippenger.init(crs.getData());

  const prover = new Prover(workerPool.workers[0], pippenger, fft);

  const standardExampleProver = new StandardExampleProver(prover);
  await standardExampleProver.initCircuitDefinition(serialised_circuit);
  const standardExampleVerifier = new StandardExampleVerifier();

  // Create proving key with a dummy CRS
  await standardExampleProver.computeKey();
  // Create verifier key *and* patch proving key with the CRS
  await standardExampleVerifier.computeKey(pippenger.pool[0], crs.getG2Data());

  // Compute smart contract and cache it
  await standardExampleVerifier.computeSmartContract(
    pippenger.pool[0],
    crs.getG2Data(),
    serialised_circuit
  );

  return {
    prover: await standardExampleProver,
    verifier: await standardExampleVerifier,
  };
}

function uint8ArrayIsEqual(arr1: Uint8Array | null, arr2: Uint8Array | null) {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

interface ActiveSetup {
  acir: ACIR;
  prom: Promise<{
    prover: StandardExampleProver;
    verifier: StandardExampleVerifier;
  }>;
}

class TurboPlonkStandardNoirConfig
  implements StandardNoirProverConfig, StandardNoirVerifierConfig
{
  private activeSetup: null | ActiveSetup = null;

  private assertSetup(acir: Uint8Array) {
    if (!uint8ArrayIsEqual(acir, this.activeSetup?.acir)) {
      throw new Error("Wrong acir active");
    }
    if (!this.activeSetup) {
      throw new Error("Must first prepare");
    }
  }

  async prepare(acir: Uint8Array) {
    if (uint8ArrayIsEqual(acir, this.activeSetup?.acir)) {
      await this.activeSetup.prom;
      return;
    }
    if (this.activeSetup) {
      // TODO: clean up resources
    }
    this.activeSetup = {
      acir,
      prom: setup_generic_prover_and_verifier(acir),
    };
    await this.activeSetup.prom;
  }

  async prove(acir: Uint8Array, intermediateWitness: IntermediateWitness) {
    this.assertSetup(acir);
    const assignments = intermediate_witness_to_assignment_bytes(
      new Map(
        Object.entries(intermediateWitness).map(([k, v]) => [Number(k), v])
      )
    );
    const { prover } = await this.activeSetup.prom;
    const proof = prover.createProof(assignments);
    // TODO: remove prepended public variables
    return proof;
  }

  async verify(
    acir: Uint8Array,
    proof: Uint8Array,
    _publicWitness: PublicWitness
  ) {
    this.assertSetup(acir);
    const { verifier } = await this.activeSetup.prom;
    // TODO: prepend public variables once proof has been normalised
    const isValid = verifier.verifyProof(proof);
    return isValid;
  }
}

const sharedConfigInstance = new TurboPlonkStandardNoirConfig();

export const TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG: StandardNoirProverConfig = {
  prepare: (acir) => sharedConfigInstance.prepare(acir),
  prove: async (acir, intermediateWitness) =>
    sharedConfigInstance.prove(acir, intermediateWitness),
};

export function createTurboPlonkStandardNoirProver() {
  return new StandardNoirProver(
    TURBO_PLONK_SIMPLE_NOIR_PROVER_CONFIG,
    new StopgapBarretenbergCachedNoirCircuitSolver()
  );
}

export const TURBO_PLONK_SIMPLE_NOIR_VERIFIER_CONFIG: StandardNoirVerifierConfig =
  {
    prepare: (acir) => sharedConfigInstance.prepare(acir),
    verify: async (acir, proof, publicWitness) =>
      sharedConfigInstance.verify(acir, proof, publicWitness),
  };

export function createTurboPlonkStandardNoirVerifier() {
  return new StandardNoirVerifier(TURBO_PLONK_SIMPLE_NOIR_VERIFIER_CONFIG);
}
