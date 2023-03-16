import "../styles/globals.css";
import Header from "./components/header";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Footer from "./components/footer";
import RootProvider from "./contexts";
import Notifications from "./components/notifications/notifications";
// If loading a variable font, you don't need to specify the font weight
const IBM_FONT = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "600", "700"],
  subsets: ["arabic"],
});
export const metadata = {
  title: {
    default: "عقار",
    template: "عقار | %s",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="rtl" className={IBM_FONT.className} lang="ar">
      <head>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body>
        <RootProvider>
          <Header />
          {children}
          <Footer />
          <Notifications />
        </RootProvider>
      </body>
    </html>
  );
}
