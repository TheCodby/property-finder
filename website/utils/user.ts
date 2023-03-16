import jwt from "jsonwebtoken";
import { getCookie, setCookie } from "cookies-next";
export const getUserData = () => {
  try {
    const token = getCookie("token") as string;
    if (!token) {
      throw new Error("No token found");
    }
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error("Invalid Token");
    }
    return decoded;
  } catch (err) {
    return null;
  }
};
export const getUserSession: any = async () => {
  const token = getCookie("token") as string;
  if (!token) {
    return null;
  }
  try {
    let resp = await fetch("http://127.0.0.1:40200/user/session", {
      headers: {
        authorization: getCookie("token") as string,
      },
    });
    if (resp.ok) {
      return resp.json();
    } else {
      setCookie("token", "", { maxAge: 0 });
      return null;
    }
  } catch (err) {
    return null;
  }
};
