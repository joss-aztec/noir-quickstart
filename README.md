# Noir Proving and Verifying Quickstart

Preconfigured helpers for proving and verifying noir circuit compiled and Turbo PLONK.

## Proving

```typescript
import { createDefaultProver } from "@noir-lang/quickstart";
import circuit from "./circuit.json"; // Not yet sure if it's smart to put this in json

const prover = createDefaultProver();
const { returnValue, proof, publicWitness } = await prover.prover(circuit, {
  some_input: 123,
});
```

## Verifying

```typescript
import { createDefaultVerifier } from "@noir-lang/quickstart";

const verifier = createDefaultVerifier();
const isValid = verifier.verify(circuit.acir, publicWitness);
```
