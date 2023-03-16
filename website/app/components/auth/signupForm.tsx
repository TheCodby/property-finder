"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useNotifs } from "../../../stores/notifs";
import LoadingButton from "../ui/loading-button";
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
  const sendLoginRequest = (e: any) => {
    e.preventDefault();
    setLoading(true);
    fetch(`http://127.0.0.1:4000/auth/sign-up`, {
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
      });
    setLoading(false);
  };
  return (
    <form
      className="flex flex-col space-y-4 justify-center lg:items-center"
      onSubmit={sendLoginRequest}
    >
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        <input
          type="text"
          placeholder="الإسم الأول"
          required
          className="lg:w-1/2"
          onChange={(e) =>
            dispatch({ type: "firstName", payload: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="الإسم الأخير"
          required
          className="lg:w-1/2"
          onChange={(e) =>
            dispatch({ type: "lastName", payload: e.target.value })
          }
        />
      </div>
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
