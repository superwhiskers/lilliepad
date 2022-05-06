import { headers, HOST, handleResponse } from "./common";
import { Id } from "./types/common";
import { User } from "./types/users";

const USERS = `${HOST}/users`;

export const fetchUser = (id: Id): Promise<User> =>
  fetch(`${USERS}/${id}`, { headers })
    .then(handleResponse);

export const generateDefaultAvatarUrl = (id: Id) =>
  `${USERS}/${id}/default_avatar`;
