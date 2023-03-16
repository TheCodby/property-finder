import { NextPage } from "next";
import Link from "next/link";
import SignupForm from "../../components/auth/signupForm";

export const metadata = {
  title: "تسجيل حساب",
};
// @ts-expect-error
const SignupPage: NextPage = async () => {
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ height: "80vh" }}
    >
      <div className="lg:w-1/4">
        <div className="card">
          <div className="title">
            <p className="text-2xl">مرحبًا بك ، سجل الآن</p>
          </div>
          <SignupForm />
        </div>
        <div className="flex w-full justify-between mt-4 text-xl">
          <Link className="text-xs lg:text-sm text-gray-900" href="/auth/login">
            هل لديك حساب بالفعل؟ سجل دخول
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;
