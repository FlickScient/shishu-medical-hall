import type { Metadata } from "next";
import "./globals.css";
import "./home-experience-v2.css";
import "./auth-refresh.css";

export const metadata: Metadata = {
  title: "Shishu Medical Hall | অর্জুন ডাক্তারের দোকান",
  description: "Shishu Medical Hall — trusted local pharmacy and medicine store management.",
  icons: { icon: "/logo.jpg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
