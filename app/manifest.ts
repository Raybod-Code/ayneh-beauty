import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "آینه بیوتی",
    short_name: "Ayneh",
    description: "سالن زیبایی و اسپا لوکس",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#C6A87C",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", // ✅ اصلاح شد (فقط یک کلمه)
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable", // ✅ اصلاح شد
      },
    ],
  };

}
