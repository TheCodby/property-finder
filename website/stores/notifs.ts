import { atom, useRecoilState } from "recoil";

export const notifsState = atom({
  key: "NotifsState",
  default: [] as { id: string; message: string; type: string }[],
});

export const useNotifs = () => {
  const [notifs, setNotifs] = useRecoilState(notifsState);
  const add = (message: string, type: string) => {
    const id = new Date().getTime().toString();
    if (notifs.length >= 4) {
      setNotifs((prev: any) => removeNotif(prev, prev[0].id));
    }
    setNotifs((prev: any) => {
      return [...prev, { id, message, type }];
    });
    setTimeout(() => {
      setNotifs((prev: any) => removeNotif(prev, id));
    }, 5000);
  };
  return { notifs, add };
};

export const removeNotif = (notifs: any, id: string) => {
  return notifs.filter((notif: any) => notif.id !== id);
};
