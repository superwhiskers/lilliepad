import uri from "mouri";

import { headers, HOST } from "./common";
import { Id } from "./types/common";
import {
  FetchOptions,
  Message,
  RetrievedMessages,
  SendMessage,
} from "./types/messages";

export const sendMessage = (
  channel: Id,
  data: SendMessage,
): Promise<Message> =>
  fetch(`${HOST}/channels/${channel}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })
    .then((res) => res.json());

// TODO: fix mouri typings
export const fetchMessages = <T extends boolean = false>(
  channel: Id,
  params: FetchOptions<T> = {},
): Promise<RetrievedMessages<T>> =>
  fetch(uri`${HOST}/channels/${channel}/messages?${params}`, { headers })
    .then((res) => res.json());
