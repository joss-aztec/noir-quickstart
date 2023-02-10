import { normaliseNoirCircuitInput } from "./noir_circuit_values";

describe("normaliseNoirCircuitInput", () => {
  it("converts all fields to hex strings", () => {
    const normalised = normaliseNoirCircuitInput({
      foo: 123,
      bar: "0x01",
      baz: [1, "2", 3],
      moo: {
        x: [true, false],
      },
    });
    expect(normalised).toEqual({
      foo: "0x7b",
      bar: "0x01",
      baz: ["0x01", "0x02", "0x03"],
      moo: {
        x: ["0x01", "0x00"],
      },
    });
  });

  it("rejects values that can't be normalised", () => {
    expect(() => normaliseNoirCircuitInput({ x: "hello!" })).toThrow();
  });
});
