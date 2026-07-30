import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "四人工位 · 共享云工位",
  description: "四个朋友的互动式实习打卡空间",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
