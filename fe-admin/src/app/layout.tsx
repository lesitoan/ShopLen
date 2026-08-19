import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import AppProviders from "./providers";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Quản trị Tiệm Len Nhà Kiều",
  description: "Trang dashboard quản lý bán hàng của Tiệm Len Nhà Kiều",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
