import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SyncProvider from "@/components/SyncProvider";
import AuthProvider from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Matric English Quiz";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Practice quiz for South African Grade 12 English Home Language final exams",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased [color-scheme:light-dark]`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-full bg-gray-50 text-gray-900 font-sans dark:bg-slate-900">
        <Script
          id="dark-mode-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("matric-english-dark")==="true")document.documentElement.classList.add("dark")}catch(e){}`
          }}
        />
        <AuthProvider>
          <div className="fixed top-4 right-4 z-50">
            <UserMenu />
          </div>
          <SyncProvider>{children}</SyncProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
