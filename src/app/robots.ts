import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/book-meeting",
          "/start-project",
          "/auth/login",
          "/auth/signup",
        ],
        disallow: [
          "/admin/",
          "/client/",
          "/reset-password/",
          "/auth/forgot-password/",
        ],
      },
    ],

    sitemap:
      "https://client.zaynex.tech/sitemap.xml",

    host:
      "https://client.zaynex.tech",
  };
}