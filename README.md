# Noir Proving and Verifying Quickstart

Preconfigured helpers for proving and verifying noir circuits compiled with Turbo PLONK.

## Proving

```typescript
import { createDefaultProver } from "@noir-lang/quickstart";
import circuit from "./circuit.json"; // Not yet sure if it's smart to put this in json

const prover = createDefaultProver();

// ...

const input = {
  some_public_value: 123,
  some_private_value: 456,
};
const { returnValue, proof, publicWitness } = await prover.prover(
  circuit,
  input
);
```

## Verifying

```typescript
import { createDefaultVerifier } from "@noir-lang/quickstart";

const verifier = createDefaultVerifier();

// ...

const publicParameters = {
  some_public_value: 123,
  returnValue,
};
const isValid = verifier.verify(circuit, publicParameters);
```
