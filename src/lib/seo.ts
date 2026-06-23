import type { Metadata } from "next";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateSeo({
  title,
  description,
  image = "/og-image.png",
  noIndex = false,
}: SeoProps = {}): Metadata {
  const siteName =
    "Zaynex Client Portal";

  const siteUrl =
    process.env
      .NEXT_PUBLIC_SITE_URL ||
    "https://client.zaynex.tech";

  const seoTitle = title
    ? `${title} | ${siteName}`
    : siteName;

  const seoDescription =
    description ||
    "Track projects, meetings, invoices, support tickets, and updates from Zaynex.";

  return {
    title: seoTitle,
    description:
      seoDescription,

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      title: seoTitle,
      description:
        seoDescription,
      url: siteUrl,
      siteName: "Zaynex",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card:
        "summary_large_image",
      title: seoTitle,
      description:
        seoDescription,
      images: [image],
    },
  };
}