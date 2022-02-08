export const HOST = "https://api.revolt.chat";

// todo: make this not hardcoded..
export const TOKEN = localStorage.getItem('TOKEN')!

export const headers: HeadersInit = {
  "x-bot-token": TOKEN,
  "content-type": "application/json",
};
