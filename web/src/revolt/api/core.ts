import { headers, HOST } from "./common";
import type { RevoltConfiguration } from "./types/core";

const CORE = HOST;

export function queryInfo(): Promise<RevoltConfiguration> {
  return fetch(CORE, { headers })
    .then((res) => res.json());
}
