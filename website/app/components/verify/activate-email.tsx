import { Dialog, Transition } from "@headlessui/react";
import { getCookie } from "cookies-next";
import { Fragment, useState } from "react";
import { useMutation } from "react-query";
import { API_LINK } from "../../../constants";
import { useNotifs } from "../../../stores/notifs";
import { getUserData } from "../../../utils/user";
import LoadingButton from "../ui/loading-button";
const ActivateEmail = () => {
  let [isOpen, setIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ message: string; type?: string }>({
    message: "",
  });
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const sendVerification = async () => {
    setLoading(true);
    const response = await fetch(`${API_LINK}/auth/send_verification_email`, {
      headers: {
        authorization: getCookie("token") as string,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage({ message: data.message, type: "error" });
    } else {
      setMessage({ message: data.message, type: "success" });
      setDisabled(true);
    }
    setLoading(false);
  };
  const session: any = getUserData();
  return (
    <>
      <button
        onClick={openModal}
        className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex items-center justify-center w-full"
      >
        <span className="text-lg text-center font-medium text-gray-900">
          تفعيل عبر البريد الإلكتروني
        </span>
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    تفعيل عبر البريد الإلكتروني
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      سنقوم بإرسال رابط تفعيل الحساب الخاص بك على البريد
                      الإلكتروني التالي
                    </p>
                    <p className="text-lg font-bold">{session?.email}</p>
                  </div>

                  <div className="flex flex-row justify-center gap-4 mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none disabled:bg-gray-300"
                      disabled={disabled}
                      onClick={sendVerification}
                    >
                      {loading ? <LoadingButton /> : "إرسال التفعيل"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none"
                      onClick={closeModal}
                    >
                      إغلاق
                    </button>
                  </div>
                  <Transition
                    show={message?.message !== ""}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div
                      className={`text-center ${
                        message?.type === "success"
                          ? "bg-green-100"
                          : "bg-red-100"
                      } text-black font-semibold rounded-lg p-3 mt-2`}
                    >
                      <p
                        className={
                          message?.type === "success"
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {message?.message}
                      </p>
                    </div>
                  </Transition>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ActivateEmail;
