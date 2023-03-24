"use client";

import ErrorBox from "@/app/components/ui/error-box";
import LoadingButton from "@/app/components/ui/loading-button";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import ToggleButton from "@/app/components/ui/toggle-button";
import { useNotifs } from "@/stores/notifs";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
function SettingsPage() {
  const [enabledEmailVerify, setEnabledEmailVerify] = useState<boolean>(false);
  const { add: addNotification } = useNotifs();
  const [config, setConfig] = useState<any>({});
  const { isLoading, error, data }: any = useQuery(
    "settings",
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/admin/settings`,
        {
          headers: {
            authorization: getCookie("token") as string,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setConfig(data);
      return data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const mutation = useMutation(
    (newConfig: any) => {
      return fetch(`${process.env.NEXT_PUBLIC_API_LINK}/admin/settings`, {
        method: "PUT",
        headers: {
          authorization: getCookie("token") as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConfig),
      });
    },
    { onSuccess: () => addNotification("تم تحديث الإعدادات بنجاح", "success") }
  );
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorBox error={error?.message} />;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 card">
        <p className="text-2xl font-semibold">إعدادات الرفع</p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:basis-1/2">
            <label htmlFor="aws-access-key">AWS Access Key</label>
            <input
              onChange={(e) =>
                setConfig((oldConf: any) => {
                  return { ...oldConf, AWS_ACCESS_KEY_ID: e.target.value };
                })
              }
              type="text"
              id="aws-access-key"
              className="w-full"
              value={data.AWS_ACCESS_KEY_ID}
              required
            />
          </div>
          <div className="md:basis-1/2">
            <label htmlFor="aws-secret-access-key">AWS Access Secret Key</label>
            <input
              onChange={(e) =>
                setConfig((oldConf: any) => {
                  return { ...oldConf, AWS_SECRET_ACCESS_KEY: e.target.value };
                })
              }
              type="text"
              id="aws-secret-access-key"
              className="w-full"
              value={data.AWS_SECRET_ACCESS_KEY}
              required
            />
          </div>
        </div>
        <p className="text-2xl font-semibold">إعدادات البريد الإلكتروني</p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:basis-1/2">
            <label htmlFor="send-grid-key">Sendgrid API Key</label>
            <input
              onChange={(e) =>
                setConfig((oldConf: any) => {
                  return { ...oldConf, SENDGRID_API_KEY: e.target.value };
                })
              }
              type="text"
              id="send-grid-key"
              className="w-full"
              value={data.SENDGRID_API_KEY}
              required
            />
          </div>
          <div className="md:basis-1/2">
            <label htmlFor="sendgrid-sender-email">Sendgrid sender email</label>
            <input
              onChange={(e) =>
                setConfig((oldConf: any) => {
                  return { ...oldConf, SENDGRID_EMAIL: e.target.value };
                })
              }
              type="text"
              id="sendgrid-sender-email"
              className="w-full"
              value={data.SENDGRID_EMAIL}
              required
            />
          </div>
        </div>
        <ToggleButton
          text="التفعيل عبر البريد الإلكتروني"
          state={config.VERIFYING_EMAILS}
          onChange={() =>
            setConfig((oldConf: any) => {
              return {
                ...oldConf,
                VERIFYING_EMAILS: !oldConf.VERIFYING_EMAILS,
              };
            })
          }
        />
      </div>
      <div className="text-center">
        <button
          disabled={mutation.isLoading}
          onClick={(event) => {
            event.preventDefault();
            mutation.mutate(config);
          }}
        >
          {mutation.isLoading ? <LoadingButton /> : "حفظ"}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
