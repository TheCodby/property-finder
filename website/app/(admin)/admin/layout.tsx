import "@/styles/globals.css";
import "@/styles/admin.css";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Sidebar from "./components/sidebar";
import RootProvider from "@/app/contexts";
import Notifications from "@/app/components/notifications/notifications";
const IBM_FONT = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "600", "700"],
  subsets: ["arabic", "latin"],
});
export const metadata = {
  title: {
    default: "لوحة التحكم",
    template: "لوحة التحكم | %s",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html dir="rtl">
      <head />
      <body className={`${IBM_FONT} flex flex-row bg-gray-200 min-h-screen`}>
        <RootProvider>
          <Sidebar />
          <div className=" rounded-3xl w-full p-5">{children}</div>
          <Notifications />
        </RootProvider>
      </body>
    </html>
  );
}

export default Layout;
