import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { isRTL } from "@convex-starter/i18n";
import "../index.css";
import Providers from "@/components/providers";
import { LayoutContent } from "@/components/layout-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://convex-starter.app";

export const metadata: Metadata = {
  title: {
    default: "Convex SaaS Starter - Ship Your SaaS Faster",
    template: "%s | Convex SaaS Starter",
  },
  description:
    "The complete SaaS starter kit with Next.js, Expo React Native, Convex, Better Auth, Polar payments, and RevenueCat. Launch your cross-platform SaaS in days, not months.",
  keywords: [
    "SaaS starter kit",
    "Next.js SaaS template",
    "Convex",
    "React Native",
    "Expo",
    "Better Auth",
    "Polar payments",
    "RevenueCat",
    "TypeScript",
    "full-stack starter",
    "cross-platform",
  ],
  authors: [{ name: "Convex Starter" }],
  creator: "Convex Starter",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Convex SaaS Starter",
    title: "Convex SaaS Starter - Ship Your SaaS Faster",
    description:
      "The complete cross-platform SaaS starter kit. Authentication, payments, subscriptions, AI, file uploads, and more — all pre-configured.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convex SaaS Starter - Ship Your SaaS Faster",
    description:
      "The complete cross-platform SaaS starter kit. Authentication, payments, subscriptions, AI, file uploads, and more — all pre-configured.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <LayoutContent>{children}</LayoutContent>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
