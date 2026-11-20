import { HomeExperienceV3 } from "@/components/home-experience-v3";

type HomeProfile = { shop_name?: string; local_name?: string; tagline_bn?: string; tagline_en?: string; phone?: string; address?: string; doctor_name?: string; proprietor_name?: string };

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
    } catch {
      // The public site remains available if editable profile content is temporarily unavailable.
    }
    try {
      const response = await fetch(dataUrl.replace(/\/$/, "") + "/medicines?select=id", {
        headers: { Prefer: "count=exact", Range: "0-0" },
        next: { revalidate: 300 }
      });
      if (response.ok) {
        const contentRange = response.headers.get("content-range");
        const match = contentRange?.match(/\/(\d+)$/);
        if (match) medicineCount = Number(match[1]);
      }
    } catch {
      // Optional public count: do not let it affect homepage availability.
    }
  }
  return <HomeExperienceV3 profile={profile} medicineCount={medicineCount} />;
}
