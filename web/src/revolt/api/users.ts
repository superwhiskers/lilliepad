import { headers, HOST } from "./common";
import { Id } from "./types/common";
import { User } from "./types/users";

const USERS = `${HOST}/users`;

export const fetchUser = (id: Id): Promise<User> =>
  fetch(`${USERS}/${id}`, { headers })
    .then((res) => res.json());

export const generateDefaultAvatarUrl = (id: Id) => `${USERS}/${id}/default_avatar`;
