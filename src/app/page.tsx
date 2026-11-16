import Link from "next/link";
import { ArrowUpRight, HeartPulse, MapPin, Phone, ShieldCheck, Stethoscope, Pill, Clock3 } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, title: "বিশ্বস্ত সেবা", en: "Trusted service", copy: "পরিচিত মানুষের জন্য আন্তরিক ও দায়িত্বশীল সেবা।", copyEn: "Friendly, responsible service for our local community." },
  { icon: Pill, title: "ওষুধ ও স্বাস্থ্যসামগ্রী", en: "Medicines & essentials", copy: "দৈনন্দিন প্রয়োজনীয় ওষুধ ও স্বাস্থ্যসামগ্রীর খোঁজ নিন।", copyEn: "Everyday medicines and healthcare essentials." },
  { icon: Stethoscope, title: "স্থানীয় পরিচিতি", en: "A familiar local name", copy: "এলাকায় অনেকেই চেনেন অর্জুন ডাক্তারের দোকান নামে।", copyEn: "A familiar neighbourhood pharmacy." }
];
type HomeProfile = { shop_name?: string; local_name?: string; tagline_bn?: string; tagline_en?: string; phone?: string; address?: string; doctor_name?: string; proprietor_name?: string };

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ lang?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const isEnglish = params.lang === "en";
  const dataUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;
  let profile: HomeProfile = {};
  if (dataUrl) {
    try {
      const response = await fetch(dataUrl + "/website_content?select=content&content_key=eq.homepage", { next: { revalidate: 60 } });
      if (response.ok) { const rows = await response.json(); profile = rows?.[0]?.content ?? {}; }
    } catch { /* Keep public pages available if the Data API is temporarily unavailable. */ }
  }
  const shopName = profile.shop_name || "Shishu Medical Hall";
  const localName = profile.local_name || "অর্জুন ডাক্তারের দোকান";
  const phone = profile.phone || "";
  const address = profile.address || "";
  const tagline = isEnglish ? (profile.tagline_en || "Your neighbourhood pharmacy.") : (profile.tagline_bn || "স্বাস্থ্যসেবায় আস্থার এক পরিচিত ঠিকানা।");
  const owner = profile.doctor_name || profile.proprietor_name || "";
  return <main className="site-shell min-h-screen">
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label={shopName}><img src="/logo.jpg" alt="" className="brand-logo"/><span className="brand-copy"><strong>{shopName}</strong><small>{localName}</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#about">{isEnglish ? "About" : "পরিচিতি"}</a><a href="#services">{isEnglish ? "Our care" : "আমাদের সেবা"}</a><a href="#contact">{isEnglish ? "Contact" : "যোগাযোগ"}</a></nav>
      <div className="header-actions"><Link href={isEnglish ? "/" : "/?lang=en"} className="language-toggle">{isEnglish ? "বাংলা" : "EN"}</Link><Link href="/dashboard" className="management-link">{isEnglish ? "Store login" : "স্টোর লগইন"} <ArrowUpRight size={15}/></Link></div>
    </header>
    <section className="hero-section">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot"/> {isEnglish ? "YOUR LOCAL PHARMACY" : "আপনার এলাকার পরিচিত ফার্মেসি"}</div>
        <h1>{isEnglish ? <>Everyday care.<br/><span>Close to home.</span></> : <>প্রতিদিনের যত্ন,<br/><span>আপনার কাছেই।</span></>}</h1>
        <p className="hero-description">{shopName} — {isEnglish ? "known locally as" : "আপনাদের পরিচিত"} <strong>{localName}</strong>। {isEnglish ? "Here for your everyday medicine and healthcare essentials." : "প্রয়োজনীয় ওষুধ ও স্বাস্থ্যসামগ্রীর জন্য পাশে আছি।"}</p>
        <div className="hero-actions"><a href="#contact" className="primary-action">{isEnglish ? "Get in touch" : "যোগাযোগ করুন"} <ArrowUpRight size={17}/></a><a href="#about" className="secondary-action">{isEnglish ? "Discover more" : "আরও জানুন"}</a></div>
        <div className="hero-trust"><span><ShieldCheck size={16}/> {isEnglish ? "Local & familiar" : "পরিচিত ও নির্ভরযোগ্য"}</span><i/><span><Clock3 size={16}/> {isEnglish ? "Here when you need us" : "প্রয়োজনে পাশে আছি"}</span></div>
      </div>
      <div className="hero-visual" aria-label="Shishu Medical Hall healthcare identity">
        <div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/>
        <div className="medical-card">
          <div className="medical-card-top"><span>SMH <b>/</b> HEALTH & CARE</span><span className="live-mark"><i/> {isEnglish ? "LOCAL PHARMACY" : "স্থানীয় ফার্মেসি"}</span></div>
          <div className="heart-stage"><div className="heart-halo"/><HeartPulse className="beating-heart" strokeWidth={1.45} aria-hidden="true"/><svg className="pulse-line" viewBox="0 0 360 54" fill="none" aria-hidden="true"><path d="M0 28H92L112 28L128 10L147 46L165 3L184 28H360" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <div className="medical-card-bottom"><div><small>{isEnglish ? "CARE THAT FEELS CLOSE" : "আপনার পাশে, প্রতিদিন"}</small><strong>{localName}</strong></div><span className="card-cross">+</span></div>
        </div>
        <div className="floating-note"><span className="note-icon"><HeartPulse size={17}/></span><span><b>{isEnglish ? "People first" : "মানুষ আগে"}</b><small>{isEnglish ? "Care with responsibility" : "যত্ন ও দায়িত্বের সঙ্গে"}</small></span></div>
      </div>
    </section>
    <section id="about" className="intro-strip"><div><span className="section-kicker">{isEnglish ? "A NAME YOU KNOW" : "আপনার চেনা একটি নাম"}</span><h2>{isEnglish ? "Familiar people. Familiar trust." : "পরিচিত মানুষ, পরিচিত আস্থা।"}</h2></div><p>{isEnglish ? "A neighbourhood pharmacy built around the everyday needs of the people it serves." : "এলাকার মানুষের দৈনন্দিন প্রয়োজনকে গুরুত্ব দিয়ে, আন্তরিকতার সঙ্গে সেবা দেওয়াই আমাদের লক্ষ্য।"}</p></section>
    <section id="services" className="service-grid">{highlights.map(({icon:Icon,title,en,copy,copyEn},index)=><article key={en} className="service-card"><div className="service-icon"><Icon size={21}/></div><div className="service-number">0{index+1}</div><h3>{isEnglish ? en : title}</h3><p>{isEnglish ? copyEn : copy}</p></article>)}</section>
    <footer id="contact" className="contact-panel">
      <div className="contact-heading"><span className="section-kicker">{isEnglish ? "COME SAY HELLO" : "যোগাযোগ করুন"}</span><h2>{isEnglish ? "We are here for you." : "আমরা আছি আপনার পাশে।"}</h2><p>{tagline}</p>{owner && <small className="owner-line">{isEnglish ? "Doctor / Proprietor" : "ডাক্তার / স্বত্বাধিকারী"}: {owner}</small>}</div>
      <div className="contact-details"><div><MapPin size={18}/><span><small>{isEnglish ? "Find us" : "ঠিকানা"}</small><strong>{address || (isEnglish ? "Address to be updated" : "ঠিকানা যোগ করা হয়নি")}</strong></span></div><div><Phone size={18}/><span><small>{isEnglish ? "Call the shop" : "ফোন"}</small><strong>{phone || (isEnglish ? "Phone to be updated" : "ফোন নম্বর যোগ করা হয়নি")}</strong></span></div></div>
    </footer>
    <div className="site-footer"><span>© {new Date().getFullYear()} {shopName}</span><span>{isEnglish ? "Made for better everyday care." : "প্রতিদিনের যত্নে, আপনার পাশে।"}</span></div>
  </main>;
}
