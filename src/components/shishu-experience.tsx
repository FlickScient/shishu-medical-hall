"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { healthGuides } from "@/lib/health-guides";
import styles from "./shishu-experience.module.css";

type Profile = {
  shop_name?: string;
  local_name?: string;
  phone?: string;
  address?: string;
  proprietor_name?: string;
};

const heartModel = "https://cdn.humanatlas.io/digital-objects/ref-organ/heart-female/v1.3/assets/3d-vh-f-heart.glb";

function Header({ shop, language, toggle }: { shop: string; language?: "en" | "bn"; toggle?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <img src="/logo.jpg" alt="" />
        <span><b>{shop}</b><small>অর্জুন ডাক্তারের দোকান</small></span>
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/medicines">Medicines</Link>
        <Link href="/pharma">Pharma & science</Link>
        <Link href="/bio-intelligent">Bio Intelligent</Link>
        <Link href="/health-library">Health library</Link>
      </nav>
      <div className={styles.headerActions}>
        {toggle && <button className={styles.language} onClick={toggle}>{language === "bn" ? "EN" : "বাংলা"}</button>}
        <Link className={styles.portal} href="/dashboard">Store portal <span>↗</span></Link>
        <button className={styles.menuButton} aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? "×" : "☰"}</button>
      </div>
      {menuOpen && <nav className={styles.mobileNav}>
        <Link onClick={() => setMenuOpen(false)} href="/medicines">Medicines</Link>
        <Link onClick={() => setMenuOpen(false)} href="/pharma">Pharma & science</Link>
        <Link onClick={() => setMenuOpen(false)} href="/bio-intelligent">Bio Intelligent</Link>
        <Link onClick={() => setMenuOpen(false)} href="/health-library">Health library</Link>
        <Link onClick={() => setMenuOpen(false)} href="/dashboard">Store portal</Link>
      </nav>}
    </header>
  );
}

function Footer({ profile, shop }: { profile: Profile; shop: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.brand}><img src="/logo.jpg" alt="" /><span><b>{shop}</b><small>অর্জুন ডাক্তারের দোকান</small></span></Link>
          <p>A neighbourhood pharmacy. A place to understand health with more clarity.</p>
        </div>
        <div className={styles.footerColumn}><span>EXPLORE</span><Link href="/medicines">Medicine directory</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></div>
        <div className={styles.footerColumn}><span>VISIT / CONTACT</span><p>{profile.address || "Visit our pharmacy"}</p><p>{profile.phone || "Contact the pharmacy"}</p><Link href="/dashboard">Store portal ↗</Link></div>
      </div>
      <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {shop}</span><span>Educational information only · Not a diagnosis or prescription</span></div>
    </footer>
  );
}

export function ShishuHomePage({ profile = {}, medicineCount = null }: { profile?: Profile; medicineCount?: number | null }) {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [tipIndex, setTipIndex] = useState(0);
  const shop = profile.shop_name || "Shishu Medical Hall";
  const guides = useMemo(() => healthGuides.filter((guide: any) => guide?.title && guide?.intro), []);
  const tip = guides.length ? guides[tipIndex % guides.length] : null;

  return (
    <main className={styles.site}>
      <Header shop={shop} language={language} toggle={() => setLanguage(v => v === "en" ? "bn" : "en")} />
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><i /> A LOCAL PHARMACY · A WORLD OF KNOWLEDGE</span>
          <h1>{language === "bn" ? <>স্বাস্থ্যকে বুঝুন।<br /><em>আরও আত্মবিশ্বাসে।</em></> : <>Care begins<br />with <em>clarity.</em></>}</h1>
          <p>{language === "bn" ? "ওষুধ, মানবদেহ এবং আধুনিক স্বাস্থ্যবিজ্ঞানের বিষয়গুলো জানুন—সহজভাবে, নির্ভরযোগ্য তথ্যের ভিত্তিতে।" : "A neighbourhood pharmacy with a place to explore medicines, understand the human body and discover the science behind better healthcare."}</p>
          <div className={styles.heroActions}>
            <Link href="/health-library" className={styles.primaryButton}>Explore health knowledge <span>↗</span></Link>
            <Link href="/medicines" className={styles.textButton}>Browse medicine references <span>→</span></Link>
          </div>
          <div className={styles.heroFacts}><span>01 / MEDICINE REFERENCES</span><span>02 / HEALTH EDUCATION</span><span>03 / BIOLOGY & SCIENCE</span></div>
        </div>
        <div className={styles.heroVisual}>
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1500&q=88" alt="Healthcare professional in a clinical setting" />
          <div className={styles.heroImageShade} />
          <div className={styles.heroImageTop}><span>SHISHU MEDICAL HALL</span><span>EST. / LOCAL CARE</span></div>
          <div className={styles.heroImageCaption}><span>CARE, KNOWLEDGE & COMMUNITY</span><b>Health is personal.<br />Understanding should be clear.</b></div>
          <div className={styles.heroImageIndex}>01 — 04</div>
        </div>
        <a href="#explore" className={styles.scrollCue}>SCROLL TO EXPLORE <span>↓</span></a>
      </section>

      <section className={styles.introStrip} id="explore">
        <div><span className={styles.sectionLabel}>A BETTER WAY TO EXPLORE</span><h2>Useful knowledge.<br /><em>Without the noise.</em></h2></div>
        <div className={styles.stat}><b>{medicineCount === null ? "—" : medicineCount.toLocaleString("en-BD")}</b><span>Medicine records</span></div>
        <div className={styles.stat}><b>{String(guides.length).padStart(2, "0")}</b><span>Health guides</span></div>
        <div className={styles.stat}><b>04</b><span>Bio chapters</span></div>
      </section>

      <section className={styles.bioFeature}>
        <div className={styles.bioCopy}>
          <span className={styles.sectionLabel}>01 / BIO INTELLIGENT</span>
          <h2>The human body.<br /><em>Closer than ever.</em></h2>
          <p>Step inside human biology. Explore real anatomical 3D models, understand how body systems work and connect what happens inside us to the science of medicine.</p>
          <div className={styles.bioTags}><span>ANATOMY</span><span>CELL BIOLOGY</span><span>PHARMACOLOGY</span></div>
          <Link href="/bio-intelligent" className={styles.lightLink}>Enter Bio Intelligent <span>↗</span></Link>
        </div>
        <div className={styles.bioModel}>
          <div className={styles.modelGlow} />
          <ModelViewer model={heartModel} title="Interactive 3D anatomical human heart" />
          <div className={styles.modelLabel}><span>ANATOMY / PLATE 001</span><b>HUMAN HEART · 3D REFERENCE</b></div>
          <div className={styles.modelOrbitLabel}>ROTATE · EXPLORE · LEARN</div>
        </div>
      </section>

      <section className={styles.editorial}>
        <div className={styles.editorialHeading}><span className={styles.sectionLabel}>02 / EXPLORE THE KNOWLEDGE LIBRARY</span><h2>Four ways to<br /><em>look deeper.</em></h2></div>
        <div className={styles.editorialGrid}>
          <Link href="/medicines" className={styles.editorialCard}>
            <div className={styles.editorialImage}><img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=85" alt="Medicine capsules and tablets" /><span>REFERENCE / 01</span></div>
            <div className={styles.editorialCardCopy}><small>MEDICINE DIRECTORY</small><h3>Know what’s<br />in the medicine.</h3><p>Look up brands, generic ingredients and strengths through medicine references.</p><b>Explore medicines <span>↗</span></b></div>
          </Link>
          <Link href="/pharma" className={styles.editorialCard}>
            <div className={styles.editorialImage}><img src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1000&q=85" alt="Modern scientific laboratory" /><span>SCIENCE / 02</span></div>
            <div className={styles.editorialCardCopy}><small>PHARMACEUTICAL SCIENCE</small><h3>From research<br />to real treatment.</h3><p>Understand formulation, quality control, development and how medicines are made.</p><b>Explore pharma <span>↗</span></b></div>
          </Link>
          <Link href="/health-library" className={styles.editorialCard}>
            <div className={styles.editorialImage}><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85" alt="Healthcare professional reviewing medical information" /><span>LEARNING / 03</span></div>
            <div className={styles.editorialCardCopy}><small>HEALTH LIBRARY</small><h3>Understand health<br />in everyday life.</h3><p>Clear, practical educational guides built to make health topics easier to understand.</p><b>Read the library <span>↗</span></b></div>
          </Link>
        </div>
      </section>

      <section className={styles.reading}>
        <div className={styles.readingImage}><img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=85" alt="Scientific view of microscopic biological structures" /><span>HEALTH LIBRARY / FIELD NOTES</span></div>
        <div className={styles.readingCopy}><span className={styles.sectionLabel}>03 / A MOMENT TO LEARN</span>{tip ? <><h2>{tip.title}</h2><p>{tip.intro}</p><Link href={"/health-library#" + tip.id}>Read this guide ↗</Link></> : <><h2>Small steps.<br /><em>Better understanding.</em></h2><p>Explore practical health education in the Health Library.</p><Link href="/health-library">Visit the library ↗</Link></>}<button onClick={() => setTipIndex(i => (i + 1) % Math.max(guides.length, 1))} disabled={guides.length < 2}>Another reading <span>→</span></button></div>
      </section>

      <section className={styles.visit}>
        <div><span className={styles.sectionLabel}>04 / SHISHU MEDICAL HALL</span><h2>A familiar pharmacy.<br /><em>A clearer view of health.</em></h2><p>This website is an educational and information resource for the community. It is not an online medicine shop and does not provide personal diagnosis or prescriptions.</p></div>
        <div className={styles.visitDetails}><span>VISIT / CONTACT</span><p>{profile.address || "Visit our pharmacy"}</p><p>{profile.phone || "Contact the pharmacy"}</p><Link href="/dashboard">Store portal access ↗</Link></div>
      </section>
      <Footer profile={profile} shop={shop} />
    </main>
  );
}

const chapters = [
  { id: "heart", label: "The heart", system: "CARDIOVASCULAR BIOLOGY", title: "A rhythm that keeps us alive.", intro: "A muscular four-chambered pump keeps blood moving through the lungs and the rest of the body. Its valves, muscle and electrical system work together with remarkable precision.", stat: "≈ 100,000", unit: "heartbeats each day · approximate", model: heartModel, source: "HuBMAP Human Reference Atlas", sourceUrl: "https://humanatlas.io/3d-reference-library", points: ["Four chambers work in a coordinated cycle.", "Valves help blood flow in one direction.", "Electrical signals coordinate each heartbeat."] },
  { id: "lungs", label: "The lungs", system: "RESPIRATORY BIOLOGY", title: "Every breath is an exchange.", intro: "The lungs bring oxygen into the blood and remove carbon dioxide. Millions of tiny air sacs create a vast, delicate surface for gas exchange.", stat: "Millions", unit: "of alveoli support gas exchange", model: "https://cdn.humanatlas.io/digital-objects/ref-organ/lung-female/v1.4/assets/3d-vh-f-lung.glb", source: "HuBMAP Human Reference Atlas", sourceUrl: "https://humanatlas.io/3d-reference-library", points: ["Air travels through branching airways.", "Alveoli sit close to tiny blood vessels.", "Oxygen and carbon dioxide diffuse across thin walls."] },
  { id: "brain", label: "The brain", system: "NERVOUS SYSTEM", title: "The body's living control network.", intro: "The brain receives information, processes it and coordinates movement, sensation, memory and many automatic functions through vast networks of nerve cells.", stat: "≈ 86 billion", unit: "neurons · commonly cited estimate", model: "https://cdn.humanatlas.io/digital-objects/ref-organ/brain-female/v1.4/assets/3d-allen-f-brain.glb", source: "HuBMAP Human Reference Atlas", sourceUrl: "https://humanatlas.io/3d-reference-library", points: ["Neurons communicate through electrical and chemical signals.", "Different regions specialise in different functions.", "The brain and spinal cord form the central nervous system."] },
  { id: "kidneys", label: "The kidneys", system: "URINARY BIOLOGY", title: "A precise balance, all day long.", intro: "The kidneys filter blood, remove waste into urine and regulate fluid, electrolyte and acid-base balance. Their microscopic nephrons perform this work continuously.", stat: "≈ 1 million", unit: "nephrons in each kidney · approximate", model: "https://cdn.humanatlas.io/digital-objects/ref-organ/kidney-female-left/v1.3/assets/3d-vh-f-kidney-l.glb", source: "HuBMAP Human Reference Atlas", sourceUrl: "https://humanatlas.io/3d-reference-library", points: ["Blood enters specialised filtering units.", "Useful substances are returned to circulation.", "Waste and excess water leave as urine."] }
];

function ModelViewer({ model, title }: { model: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const viewer = document.createElement("model-viewer");
    viewer.setAttribute("src", model);
    viewer.setAttribute("alt", title);
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("rotation-per-second", "12deg");
    viewer.setAttribute("shadow-intensity", "1");
    viewer.setAttribute("exposure", "1.05");
    viewer.setAttribute("interaction-prompt", "auto");
    viewer.setAttribute("camera-orbit", "0deg 72deg 105%");
    viewer.setAttribute("loading", "lazy");
    viewer.style.width = "100%";
    viewer.style.height = "100%";
    viewer.style.background = "transparent";
    node.replaceChildren(viewer);
    if (!document.querySelector('script[data-shishu-model-viewer="true"]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      script.dataset.shishuModelViewer = "true";
      document.head.appendChild(script);
    }
    return () => viewer.remove();
  }, [model, title]);
  return <div ref={host} className={styles.modelStage} role="img" aria-label={title} />;
}

export function BioIntelligentExperience() {
  const [active, setActive] = useState("heart");
  const chapter = chapters.find(item => item.id === active) || chapters[0];
  const index = chapters.findIndex(item => item.id === active);
  return (
    <main className={styles.site}>
      <Header shop="Shishu Medical Hall" />
      <section className={styles.bioHero}>
        <div className={styles.bioHeroCopy}>
          <Link href="/" className={styles.backLink}>← SHISHU MEDICAL HALL</Link>
          <span className={styles.sectionLabel}>BIO INTELLIGENT / AN INTERACTIVE BIOLOGY EXPERIENCE</span>
          <h1>Life is extraordinary.<br /><em>Look closer.</em></h1>
          <p>Explore the systems that keep us alive. Move through real 3D anatomical references, understand the biology and connect what you learn to modern medicine.</p>
          <div className={styles.bioHeroMeta}><span>01 / HUMAN ANATOMY</span><span>02 / BIOLOGY</span><span>03 / PHARMACOLOGY</span></div>
          <a href="#explorer" className={styles.heroExplore}>START EXPLORING <span>↓</span></a>
        </div>
        <div className={styles.bioHeroVisual}>
          <div className={styles.bioHeroGlow} />
          <ModelViewer model={heartModel} title="Interactive 3D anatomical human heart" />
          <div className={styles.bioHeroStamp}><span>PLATE 001</span><b>HUMAN HEART / 3D</b></div>
          <span className={styles.bioHeroVertical}>CARDIOVASCULAR SYSTEM · HUMAN REFERENCE ATLAS</span>
        </div>
      </section>
      <section className={styles.bioIntro}><span>THE HUMAN BODY / AN OPEN BOOK</span><p>Every heartbeat, every breath, every cell has a story. <b>Start with one system. Discover the connections.</b></p><span>4 INTERACTIVE CHAPTERS</span></section>
      <section className={styles.explorer} id="explorer">
        <div className={styles.explorerHeading}><div><span className={styles.sectionLabel}>THE ANATOMY STUDIO / 01—04</span><h2>Choose a system.<br /><em>Explore it in 3D.</em></h2></div><p>Choose an organ to load its interactive reference model. Rotate and zoom the model, then explore the biology behind its role in the body.</p></div>
        <div className={styles.explorerLayout}>
          <aside className={styles.chapterRail}><span>CHAPTER INDEX</span>{chapters.map((item, i) => <button key={item.id} className={active === item.id ? styles.activeChapter : ""} onClick={() => setActive(item.id)}><small>0{i + 1}</small><b>{item.label}</b><span>↗</span></button>)}<div className={styles.railNote}>REAL 3D REFERENCES<br />HuBMAP / HUMAN ATLAS</div></aside>
          <article className={styles.chapterPanel}>
            <div className={styles.chapterViewer}>
              <ModelViewer key={chapter.id} model={chapter.model} title={chapter.label + " interactive 3D model"} />
              <div className={styles.viewerHud}><span>INTERACTIVE 3D MODEL</span><span>DRAG TO ROTATE · PINCH TO ZOOM</span></div>
              <a href={chapter.sourceUrl} target="_blank" rel="noreferrer" className={styles.modelSource}>MODEL SOURCE: {chapter.source} · CC BY 4.0 ↗</a>
            </div>
            <div className={styles.chapterInfo}>
              <div className={styles.chapterInfoTop}><span>{chapter.system}</span><span>CHAPTER 0{index + 1} / 04</span></div>
              <h3>{chapter.title}</h3><p>{chapter.intro}</p>
              <div className={styles.chapterStat}><b>{chapter.stat}</b><span>{chapter.unit}</span></div>
              <div className={styles.factList}>{chapter.points.map((point, i) => <div key={point}><small>0{i + 1}</small><span>{point}</span></div>)}</div>
              <div className={styles.chapterControls}><button disabled={index === 0} onClick={() => setActive(chapters[index - 1].id)}>← Previous</button><button disabled={index === chapters.length - 1} onClick={() => setActive(chapters[index + 1].id)}>Next chapter →</button></div>
            </div>
          </article>
        </div>
      </section>
      <section className={styles.bioConnection}><div><span className={styles.sectionLabel}>THE BIGGER PICTURE</span><h2>Biology explains life.<br /><em>Pharmacology connects care.</em></h2></div><p>Understanding the human body gives us a stronger foundation for understanding medicines — how they work, why they are developed and why safe use matters.</p><Link href="/pharma">Explore pharmaceutical science ↗</Link></section>
      <section className={styles.bioDisclaimer}><b>LEARNING, NOT DIAGNOSIS.</b><p>This experience is for general education. It does not diagnose, prescribe or replace advice from a registered doctor or pharmacist. Model imagery is a scientific reference, not diagnostic imaging.</p></section>
      <Footer profile={{}} shop="Shishu Medical Hall" />
    </main>
  );
}
