
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://shutter-chance.vercel.app"
  ),

  title: {
    default: "Shutter Chance｜イベントの写真共有サービス",
    template: "%s | Shutter Chance",
  },

  description:
    "イベントで撮影した写真を、みんなでかんたん共有。QRコードひとつで写真を集められ、ゲストはアプリのインストールや会員登録なしで参加できます。",

  applicationName: "Shutter Chance",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shutter Chance",
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Shutter Chance",
    title: "Shutter Chance｜イベントの写真共有サービス",
    description:
      "結婚式、パーティー、同窓会などの写真を、QRコードひとつでかんたん共有。",
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "ocDA1oaqsRD4r_nrzpEP90dJMFFimLO43MAIetEoxGw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
