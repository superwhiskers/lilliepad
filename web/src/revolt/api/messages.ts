import uri from "mouri";

import { headers, HOST, handleResponse } from "./common";
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
    .then(handleResponse);

export const fetchMessages = <IncludeUsers extends boolean = false>(
  channel: Id,
  params: FetchOptions<IncludeUsers> = {},
): Promise<RetrievedMessages<IncludeUsers>> =>
  fetch(uri`${HOST}/channels/${channel}/messages?${params}`, { headers })
    .then(handleResponse);
