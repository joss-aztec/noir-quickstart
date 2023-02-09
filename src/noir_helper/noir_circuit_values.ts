type NoirValue_Struct<TWitnessElement> = {
  [key: string]: NoirValue<TWitnessElement>;
};
type NoirValue_Array<TWitnessElement> = NoirValue<TWitnessElement>[];
type NoirValue<TWitnessElement> =
  | TWitnessElement
  | NoirValue_Struct<TWitnessElement>
  | NoirValue_Array<TWitnessElement>;

type WitnessElement_Raw = string | number | boolean;
type NoirValue_Raw = NoirValue<WitnessElement_Raw>;
export type NoirCircuitParameters = Record<string, NoirValue_Raw>;

type NormalisedWitnessElement = string; // Specifically a hex string
export type NormalisedNoirValue = NoirValue<NormalisedWitnessElement>;
export type NormalisedNoirCircuitParameters = Record<
  string,
  NormalisedNoirValue
>;

export function normaliseNoirCircuitInput(
  input: NoirCircuitParameters
): NormalisedNoirCircuitParameters {
  return normaliseNoirCircuitValue_recursive(
    input
  ) as NormalisedNoirCircuitParameters;
}

function normaliseNoirCircuitValue_recursive(
  value: NoirValue_Raw
): NormalisedNoirValue {
  if (Array.isArray(value)) {
    return value.map(normaliseNoirCircuitValue_recursive);
  } else if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [
        k,
        normaliseNoirCircuitValue_recursive(v),
      ])
    );
  } else if (typeof value === "boolean") {
    return value ? "0x01" : "0x00";
  } else if (typeof value === "number") {
    return toHexStr(value);
  } else if (typeof value === "string") {
    return toHexStr(parseInt(value));
  } else {
    throw new Error(`Unrecognised input value: '${value}'`);
  }
}

function toHexStr(value: number) {
  if (isNaN(value)) throw new Error(`Invalid input value: '${value}'`);
  return `0x${value.toString(16)}`;
}
