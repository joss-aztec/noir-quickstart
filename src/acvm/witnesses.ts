export type InitialWitness = Record<string, string>;
export type IntermediateWitness = Record<string, string>;

// It's as of yet undecided whether the public prameters used for verifying
// will be arranged in a map or a list.
// (See https://aztecprotocol.slack.com/archives/C0183F0V42V/p1676042461978399)
// Thus this entity may be replaced with another type named something like
// `PublicParameters = string[]`. (Whether or not fields should be handed to
// the verifier as strings probably also needs further consideration.)
export type PublicWitness = Record<string, string>;
