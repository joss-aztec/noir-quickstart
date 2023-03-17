import { wrap } from "comlink";
import Worker from "web-worker";
import type { INoirProver, INoirVerifier } from "./turbo_plonk_worker";

function createRemote() {
  const worker = new Worker(
    new URL("./turbo_plonk_worker.js", import.meta.url)
  );
  return wrap<INoirProver & INoirVerifier>(worker);
}

let remote: ReturnType<typeof createRemote> | undefined;

function getRemote() {
  if (!remote) {
    remote = createRemote();
  }
  return remote;
}

export function createDefaultProver(): INoirProver {
  return getRemote();
}

export function createDefaultVerifier(): INoirVerifier {
  return getRemote();
}
