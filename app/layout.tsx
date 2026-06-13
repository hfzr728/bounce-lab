import type { Metadata } from "next";
import { Inter, Bebas_Neue, Rajdhani } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout/shared";
import { UserProvider } from "@/lib/user/context";
import { ToastProvider } from "@/components/ui/toast";
import { FeedbackButton } from "@/components/feedback/feedback-button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BounceLab — 弹跳训练诊断平台",
  description: "专业的弹跳训练评估与个性化训练计划生成平台。通过科学问卷诊断你的弹跳短板，AI 辅助生成专属训练方案。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${bebasNeue.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-slate-200">
        <UserProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FeedbackButton />
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
