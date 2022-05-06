import { headers, HOST, handleResponse } from "./common";
import type { RevoltConfiguration } from "./types/core";

const CORE = HOST;

export function queryInfo(): Promise<RevoltConfiguration> {
  return fetch(CORE, { headers })
    .then(handleResponse);
}
