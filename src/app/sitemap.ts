import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    "https://client.zaynex.tech";

  return [
    {
      url: `${baseUrl}/book-meeting`,
      lastModified: new Date(),
      changeFrequency:
        "monthly",
      priority: 0.9,
    },

    {
      url: `${baseUrl}/start-project`,
      lastModified: new Date(),
      changeFrequency:
        "monthly",
      priority: 0.9,
    },

    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency:
        "yearly",
      priority: 0.5,
    },

    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency:
        "yearly",
      priority: 0.5,
    },
  ];
}