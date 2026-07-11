import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const SITE_NAME = "比特岛大冒险";
const SITE_TITLE = "比特岛大冒险｜儿童计算机启蒙课";
const SITE_DESCRIPTION = "适合小学二年级孩子的电脑基础与编程思维互动课程。";
const LOCAL_METADATA_BASE = new URL("http://localhost:3000");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function firstHeaderValue(value: string | null) {
  return value?.split(",", 1)[0]?.trim() || null;
}

function requestMetadataBase(requestHeaders: {
  get(name: string): string | null;
}) {
  const host =
    firstHeaderValue(requestHeaders.get("x-forwarded-host")) ??
    firstHeaderValue(requestHeaders.get("host"));

  if (!host) {
    return LOCAL_METADATA_BASE;
  }

  const forwardedProtocol = firstHeaderValue(
    requestHeaders.get("x-forwarded-proto"),
  );
  const localHost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : localHost
        ? "http"
        : "https";

  try {
    return new URL(`${protocol}://${host}`);
  } catch {
    return LOCAL_METADATA_BASE;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const metadataBase = requestMetadataBase(requestHeaders);

  return {
    metadataBase,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: metadataBase,
      siteName: SITE_NAME,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
