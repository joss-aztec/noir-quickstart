// A completely unsolved witness containing only the witness elements that
// correspond to circuit's inputs.
export type InitialWitness = Record<string, string>;

// A witness that has been solved only for the wires that are defined within an
// ACIR.
export type IntermediateWitness = Record<string, string>;

// The part of the witness that is necessary for proof verification.
// It's as of yet undecided whether this will be arranged in a map or a list.
// (See https://aztecprotocol.slack.com/archives/C0183F0V42V/p1676042461978399)
// Thus this entity may be replaced with another type named something like
// `PublicParameters = string[]`. (Whether or not fields should be handed to
// the verifier as strings probably also needs further consideration.)
export type PublicWitness = Record<string, string>;
