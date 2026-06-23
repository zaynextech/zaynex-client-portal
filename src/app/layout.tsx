import type { Metadata } from "next";

import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";

import { Toaster } from "@/components/ui/sonner";

import { NotificationProvider } from "@/components/providers/notification-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://client.zaynex.tech"
  ),

  title: {
    default:
      "Zaynex Client Portal",
    template:
      "%s | Zaynex Client Portal",
  },

  description:
    "Manage projects, meetings, support requests, invoices, and services with Zaynex.",

  applicationName:
    "Zaynex Client Portal",

  keywords: [
    "Zaynex",
    "Client Portal",
    "Project Management",
    "Website Development",
    "Web Applications",
    "Client Dashboard",
    "Meetings",
    "Support",
  ],

  authors: [
    {
      name: "Zaynex",
      url: "https://www.zaynex.tech",
    },
  ],

  creator: "Zaynex",

  publisher: "Zaynex",

  openGraph: {
    title:
      "Zaynex Client Portal",

    description:
      "Manage projects, meetings, support requests, invoices, and services with Zaynex.",

    url:
      "https://client.zaynex.tech",

    siteName:
      "Zaynex Client Portal",

    images: [
      {
        url:
          "https://client.zaynex.tech/og-image.png",

        width: 1200,

        height: 630,

        alt:
          "Zaynex Client Portal",
      },
    ],

    locale:
      "en_US",

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Zaynex Client Portal",

    description:
      "Manage projects, meetings, support requests, invoices, and services with Zaynex.",

    images: [
      "https://client.zaynex.tech/og-image.png",
    ],

    creator:
      "@zaynex",
  },

  icons: {
    icon: [
      {
        url:
          "/favicon.ico",
      },
    ],

    shortcut:
      "/favicon.ico",

    apple:
      "/apple-touch-icon.png",
  },

  alternates: {
    canonical:
      "https://client.zaynex.tech",
  },

  category:
    "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <NotificationProvider />

          {children}

          <Toaster
            richColors
            position="top-right"
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}