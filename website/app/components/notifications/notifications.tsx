"use client";
import React from "react";
import { useRecoilState } from "recoil";
import { notifsState, removeNotif } from "../../../stores/notifs";

const Notifications: React.FC = () => {
  const [notifs, setNotifications] = useRecoilState(notifsState);
  if (notifs.length === 0) return <></>;
  return (
    <div
      className="fixed top-4 z-10 right-8 flex flex-col space-y-4 overflow-hidden"
      dir="ltr"
    >
      {notifs.map((notif, index) => (
        <div
          className={`${
            notif.type === "error"
              ? "bg-red-100 border-red-400 text-red-700"
              : "bg-green-100 border-green-400 text-green-700"
          } border  px-4 py-3 rounded relative overflow-hidden flex flex-row`}
          key={index}
          role="alert"
        >
          <span onClick={() => setNotifications(removeNotif(notifs, notif.id))}>
            <svg
              className={`fill-current h-6 w-6 ${
                notif.type === "error" ? "text-red-500" : "text-green-500"
              }}`}
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 6.066 4.652a1 1 0 10-1.414 1.414L8.586 10l-3.934 3.934a1 1 0 001.414 1.414L10 11.414l3.934 3.934a1 1 0 001.414-1.414L11.414 10l3.934-3.934a1 1 0 000-1.414z" />
            </svg>
          </span>
          <div>
            <span className="block sm:inline">{notif.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
