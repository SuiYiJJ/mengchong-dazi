import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "文心一言｜萌宠搭子",
  description: "以文心一言为主入口，内嵌 AI 萌宠轻社交体验。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
