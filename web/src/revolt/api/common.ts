export const HOST = "https://api.revolt.chat";

// todo: make this not hardcoded..
export let TOKEN = localStorage.getItem('TOKEN')!

export const headers = {
  "x-bot-token": TOKEN,
  "content-type": "application/json",
};

export const handleResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(`[${res.status}] ${res.statusText}\n\n${await res.text()}`);
  }
  return res.status === 200 ? res.json() : {};
};

// this is hacky
export function setToken(token: string) {
  headers['x-bot-token'] = token
  TOKEN = token
}