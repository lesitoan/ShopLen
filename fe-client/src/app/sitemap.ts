import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tiemlennhakieu.io.vn";

  const routes = [
    "",
    "/san-pham",
    "/bai-viet",
    "/gioi-thieu",
    "/lien-he",
    "/faq",
    "/tra-cuu-don-hang",
    "/chinh-sach-bao-mat",
    "/dieu-khoan-su-dung",
    "/chinh-sach-doi-tra",
    "/chinh-sach-van-chuyen",
    "/chinh-sach-thanh-toan",
  ];

  const pages = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || route === "/san-pham" || route === "/bai-viet"
      ? "daily"
      : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : route === "/san-pham" || route === "/bai-viet" ? 0.9 : 0.7,
  }));

  return pages;
}
