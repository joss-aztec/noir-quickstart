export interface ACIR {
  // The hash should probably be lifted to woever needs to handle it. E.g. the
  // Noir help methods that use it for cheap comparisions. Possibly it's enough
  // to directly compare buffers.
  hash: string;
  // Note that the ACIR schema will be switched over to protobuf or FlatBuffers
  // so it may be convenient to read directly instead of via wasm.
  buffer: Uint8Array;
}
