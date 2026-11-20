import { ShishuHomePage } from "@/components/shishu-experience";

type HomeProfile = { shop_name?: string; local_name?: string; phone?: string; address?: string; doctor_name?: string; proprietor_name?: string };

export default async function HomePage() {
  let profile: HomeProfile = {};
  let medicineCount: number | null = null;
  const dataUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;
  if (dataUrl) {
    try {
      const response = await fetch(dataUrl + "/website_content?select=content&content_key=eq.homepage", { next: { revalidate: 60 } });
      if (response.ok) {
        const rows = await response.json();
        profile = rows?.[0]?.content ?? {};
      }
    } catch {}
    try {
      const response = await fetch(dataUrl.replace(/\/$/, "") + "/medicines?select=id", {
        headers: { Prefer: "count=exact", Range: "0-0" },
        next: { revalidate: 300 }
      });
      if (response.ok) {
        const match = response.headers.get("content-range")?.match(/\/(\d+)$/);
        if (match) medicineCount = Number(match[1]);
      }
    } catch {}
  }
  return <ShishuHomePage profile={profile} medicineCount={medicineCount} />;
}
