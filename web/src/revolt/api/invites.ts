import { headers, HOST } from "./common";
import type { InviteResponse, RetrievedInvite } from "./types/invites";

const INVITES = `${HOST}/invites`;

export function fetchInvite(invite: string): Promise<RetrievedInvite> {
  return fetch(`${INVITES}/${invite}`, { headers })
    .then((res) => res.json());
}

export function joinInvite(invite: string): Promise<InviteResponse> {
  return fetch(`${INVITES}/${invite}`, { method: "POST", headers })
    .then((res) => res.json());
}

export function deleteInvite(invite: string) {
  return fetch(`${INVITES}/${invite}`, { method: "DELETE", headers })
    .then((res) => res.json());
}
