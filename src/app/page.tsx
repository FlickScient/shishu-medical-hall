import { HomeExperience } from "@/components/public-experience";

type HomeProfile = { shop_name?: string; local_name?: string; tagline_bn?: string; tagline_en?: string; phone?: string; address?: string; doctor_name?: string; proprietor_name?: string };

export default async function HomePage() {
  let profile: HomeProfile = {};
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
  }
  return <HomeExperience profile={profile} />;
}
