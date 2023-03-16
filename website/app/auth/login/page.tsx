import { NextPage } from "next";
import Link from "next/link";
import LoginForm from "../../components/auth/loginForm";

export const metadata = {
  title: "تسجيل الدخول",
};
// @ts-expect-error
const LoginPage: NextPage = async () => {
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ height: "80vh" }}
    >
      <div className="p-4">
        <div className="card w-full">
          <div className="title">
            <p className="text-2xl">مرحبًا بك مرة أُخرى</p>
          </div>
          <div className="description">
            <p className="text-md">أدخل بياناتك للدخول</p>
          </div>
          <LoginForm />
        </div>
        <div className="flex w-full justify-between mt-4 text-xl">
          <Link
            className="text-xs lg:text-sm text-gray-900"
            href="/auth/sign-up"
          >
            ليس لديك حساب؟ إنشاء حساب
          </Link>
          <Link className="text-xs lg:text-sm text-gray-900" href="/">
            هل نسيت كلمة المرور؟
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
