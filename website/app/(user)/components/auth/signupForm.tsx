"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useNotifs } from "@/stores/notifs";
import LoadingButton from "../../../components/ui/loading-button";
function reducer(state: any, action: any) {
  switch (action.type) {
    case "firstName":
      return { ...state, firstName: action.payload };
    case "lastName":
      return { ...state, lastName: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}
const SignupForm: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const { add: addNotification } = useNotifs();
  const router = useRouter();
  const sendSignupRequest = (e: any) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        password: state.password,
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
        router.push("/auth/login");
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
      onSubmit={sendSignupRequest}
    >
      <input
        type="text"
        placeholder="الإسم الأول"
        required
        onChange={(e) =>
          dispatch({ type: "firstName", payload: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="الإسم الأخير"
        required
        onChange={(e) =>
          dispatch({ type: "lastName", payload: e.target.value })
        }
      />
      <input
        type="email"
        id="email"
        placeholder="البريد الإلكتروني"
        required
        onChange={(e) => dispatch({ type: "email", payload: e.target.value })}
      />
      <input
        type="password"
        id="password"
        placeholder="كلمة المرور"
        required
        onChange={(e) =>
          dispatch({ type: "password", payload: e.target.value })
        }
      />
      <button className="self-center" disabled={loading}>
        {!loading ? "تسجيل حساب" : <LoadingButton />}
      </button>
    </form>
  );
};

export default SignupForm;
