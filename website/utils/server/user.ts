import { cookies } from "next/headers";
import "server-only";
export const getSession = async () => {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/user/session`, {
    headers: {
      authorization: cookies().get("token")?.value as any,
    },
  });
  return res.json();
};
