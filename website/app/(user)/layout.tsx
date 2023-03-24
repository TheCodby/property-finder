import "@/styles/globals.css";
import Header from "./components/header";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Footer from "./components/footer";
import RootProvider from "../contexts";
import Notifications from "../components/notifications/notifications";
import Script from "next/script";
const IBM_FONT = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "600", "700"],
  subsets: ["arabic", "latin"],
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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NWCTTW43FF"
        ></script>
        <Script>
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-NWCTTW43FF');`}
        </Script>
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
