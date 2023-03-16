"use client";
import { setCookie } from "cookies-next";
import React from "react";
import { useNotifs } from "../../../stores/notifs";
import LoadingButton from "../ui/loading-button";

const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const { add: addNotification } = useNotifs();
  const sendLoginRequest = (e: any) => {
    e.preventDefault();
    setLoading(true);
    fetch(`http://127.0.0.1:4000/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw data;
          });
        }
      })
      .then(async (data) => {
        addNotification(data.message, "success");
        setCookie("token", data.token, { maxAge: 60 * 60 * 24 });
        localStorage.setItem("refresh_token", data.refresh_token);
        window.location.replace("/");
      })
      .catch((err) => {
        addNotification(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <form
      className="flex flex-col space-y-4 justify-center lg:items-center"
      onSubmit={sendLoginRequest}
    >
      <input
        type="email"
        name="email"
        id="email"
        placeholder="البريد الإلكتروني"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="كلمة المرور"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="self-center" disabled={loading}>
        {!loading ? "تسجيل الدخول" : <LoadingButton />}
      </button>
    </form>
  );
};

export default LoginForm;
