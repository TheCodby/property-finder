import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: new Map<string, string>() as Map<string, string> | null,
});
