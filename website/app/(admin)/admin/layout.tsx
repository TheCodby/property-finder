import "@/styles/globals.css";
import "@/styles/admin.css";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Sidebar from "./components/sidebar";
import RootProvider from "@/app/contexts";
import Notifications from "@/app/components/notifications/notifications";
import SidebarCloseButton from "./components/close-sidebar";

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
      <body
        className={`${IBM_FONT.className} flex flex-row bg-gray-200 min-h-screen overflow-x-hidden`}
      >
        <RootProvider>
          <Sidebar />
          <div className="w-full">
            <SidebarCloseButton />
            <div className="px-5 pb-5">{children}</div>
          </div>
          <Notifications />
        </RootProvider>
      </body>
    </html>
  );
}

export default Layout;
