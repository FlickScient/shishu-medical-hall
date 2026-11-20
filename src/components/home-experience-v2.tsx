"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BookOpen, Dna,
  FlaskConical, HeartPulse, Menu, Microscope, Pill, ShieldCheck, X,
  MapPin, Phone, Clock3, ChevronDown, RotateCcw, RotateCw
} from "lucide-react";
import { healthGuides } from "@/lib/health-guides";

type Profile = {
  shop_name?: string; local_name?: string; tagline_bn?: string; tagline_en?: string;
  phone?: string; address?: string; doctor_name?: string; proprietor_name?: string;
};

const chapters = [
  { id: "heart", no: "01", title: "The heart", category: "CARDIOVASCULAR BIOLOGY", description: "The pump, the chambers and the rhythm behind every beat.", icon: HeartPulse, color: "rose", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Human_heart.jpg?width=900", alt: "Three-dimensional anatomical human heart model" },
  { id: "cells", no: "02", title: "Cells & DNA", category: "CELLULAR BIOLOGY", description: "The microscopic structures and instructions that make life possible.", icon: Dna, color: "violet", image: "https://commons.wikimedia.org/wiki/Special:FilePath/3D_DNA.png?width=900", alt: "Three-dimensional DNA double helix render" },
  { id: "medicine", no: "03", title: "Medicines", category: "PHARMACOLOGY", description: "How active ingredients interact with living systems.", icon: FlaskConical, color: "blue", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pills.JPG?width=900", alt: "Photograph of pharmaceutical capsules" },
  { id: "research", no: "04", title: "Discovery", category: "DRUG DEVELOPMENT", description: "The evidence and research behind modern treatment.", icon: Microscope, color: "green", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Observing_Bacteria_with_a_Microscope.jpg?width=900", alt: "Laboratory worker studying a sample through a digital microscope" }
];

const molecules = [
  { id: "water", name: "Water", formula: "H₂O", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Water_Molecule_3D.jpg", type: "POLAR MOLECULE", fact: "Water's polarity helps it dissolve many substances and makes it essential for transport, temperature regulation and cellular processes.", atoms: [{x:50,y:50,z:0,t:"O"},{x:25,y:25,z:16,t:"H"},{x:75,y:25,z:-16,t:"H"}], bonds: [[0,1],[0,2]] },
  { id: "ammonia", name: "Ammonia", formula: "NH₃", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ammonia-3D-balls-B.png", type: "NITROGEN COMPOUND", fact: "Ammonia is a small nitrogen-containing molecule. Nitrogen is also essential to amino acids and nucleic acids.", atoms: [{x:50,y:48,z:0,t:"N"},{x:22,y:24,z:14,t:"H"},{x:78,y:24,z:-14,t:"H"},{x:50,y:83,z:4,t:"H"}], bonds: [[0,1],[0,2],[0,3]] },
  { id: "methane", name: "Methane", formula: "CH₄", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Methane-3D-molecular-model-engraved-render-CAS-74-82-8.png", type: "SIMPLE ORGANIC MOLECULE", fact: "Methane is the simplest alkane: one carbon atom bonded to four hydrogen atoms. Its tetrahedral geometry is a useful introduction to covalent bonding.", atoms: [{x:50,y:50,z:0,t:"C"},{x:50,y:12,z:20,t:"H"},{x:87,y:50,z:-12,t:"H"},{x:50,y:88,z:-20,t:"H"},{x:13,y:50,z:12,t:"H"}], bonds: [[0,1],[0,2],[0,3],[0,4]] }
];

function SiteHeader({ shop, language, onLanguage }: { shop: string; language: "en" | "bn"; onLanguage: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className="s2-header">
    <Link href="/" className="s2-brand"><img src="/logo.jpg" alt="" /><span><b>{shop}</b><small>অর্জুন ডাক্তারের দোকান</small></span></Link>
    <nav className="s2-nav">
      <Link href="/medicines">Medicines</Link><Link href="/pharma">Pharma & science</Link>
      <Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link>
    </nav>
    <div className="s2-actions">
      <button className="s2-language" onClick={onLanguage}>{language === "en" ? "বাংলা" : "EN"}</button>
      <Link className="s2-portal" href="/dashboard">Store portal <ArrowUpRight size={15}/></Link>
      <button className="s2-menu" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
    <AnimatePresence>{open && <motion.nav className="s2-mobile-nav" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
      <Link onClick={()=>setOpen(false)} href="/medicines">Medicines</Link><Link onClick={()=>setOpen(false)} href="/pharma">Pharma & science</Link>
      <Link onClick={()=>setOpen(false)} href="/bio-intelligent">Bio Intelligent</Link><Link onClick={()=>setOpen(false)} href="/health-library">Health library</Link>
      <Link onClick={()=>setOpen(false)} href="/dashboard">Store portal</Link>
    </motion.nav>}</AnimatePresence>
  </header>;
}

"use client";

function MoleculeStudio() {
  const [active, setActive] = useState("methane");
  const [rotation, setRotation] = useState(0);
  const molecule = molecules.find(item => item.id === active) ?? molecules[2];
  return <section className="s2-molecule-section" id="molecular-observatory">
    <div className="s2-section-head"><div><span className="s2-kicker">INTERACTIVE SCIENCE / 002</span><h2>See the structure.<br/><em>Understand the connection.</em></h2></div><p>Explore actual three-dimensional molecular renders. Choose a molecule and turn its model to examine its form.</p></div>
    <div className="s2-molecule-studio s2-molecule-studio-photo">
      <div className="s2-molecule-stage s2-molecule-stage-photo">
        <div className="s2-stage-meta"><span>MOLECULAR STUDIO / 3D RENDER</span><span>MODEL / 0{molecules.findIndex(m=>m.id===active)+1}</span></div>
        <div className="s2-molecule-photo-wrap" style={{transform:"rotateY("+rotation+"deg)"}}><img src={molecule.image} alt={"Three-dimensional molecular render of "+molecule.name+" ("+molecule.formula+")"} loading="lazy"/></div>
        <div className="s2-model-controls"><button aria-label="Rotate left" onClick={()=>setRotation(r=>r-30)}><RotateCcw size={16}/></button><button onClick={()=>setRotation(0)}>RESET VIEW</button><button aria-label="Rotate right" onClick={()=>setRotation(r=>r+30)}><RotateCw size={16}/></button></div>
        <span className="s2-stage-caption">SCIENTIFIC RENDER / PRESENTATION MODEL</span>
      </div>
      <div className="s2-molecule-details"><span className="s2-kicker">CHOOSE A MOLECULE</span>
        <div className="s2-molecule-select">{molecules.map(item=><button key={item.id} className={active===item.id?"active":""} onClick={()=>{setActive(item.id);setRotation(0)}}><span>{item.formula}</span><b>{item.name}</b><ArrowUpRight size={14}/></button>)}</div>
        <div className="s2-molecule-description"><span>{molecule.type}</span><h3>{molecule.name} <small>{molecule.formula}</small></h3><p>{molecule.fact}</p></div>
        <small className="s2-disclaimer">Educational molecular renders. Atom and bond sizes are presentation choices and are not to scale.</small>
      </div>
    </div>
  </section>;
}

function Footer({ profile }: { profile: Profile }) {
  return <footer className="s2-footer"><div className="s2-footer-main"><div><Link href="/" className="s2-brand"><img src="/logo.jpg" alt=""/><span><b>{profile.shop_name || "Shishu Medical Hall"}</b><small>{profile.local_name || "অর্জুন ডাক্তারের দোকান"}</small></span></Link><p>A local pharmacy, with clear information about medicines and the science of health.</p></div>
    <div className="s2-footer-links"><b>Explore</b><Link href="/medicines">Medicine directory</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></div>
    <div className="s2-footer-links"><b>Visit the pharmacy</b><span><MapPin size={14}/>{profile.address || "Visit our pharmacy"}</span><span><Phone size={14}/>{profile.phone || "Contact details coming soon"}</span><span><Clock3 size={14}/>Local pharmacy</span></div></div>
    <div className="s2-footer-bottom"><span>© {new Date().getFullYear()} {profile.shop_name || "Shishu Medical Hall"}</span><span>Educational information only · Not a diagnosis or prescription.</span></div>
    <p className="s2-image-credit">Image credits: Human heart — Rayhana Alhour (CC0); DNA — Tim Tim (CC BY-SA 4.0); pharmaceutical laboratory — Wellcome Images (CC BY 4.0); laboratory microscope — Asamoah Daniel Kwame Oware (CC0); bacteria microscopy — M Joko Apriyo Putro (CC0); pills — Ayena (Public Domain); methane render — MolGod Scientific (CC BY-SA 4.0); ammonia and water models — Ben Mills / Chemitorium (Public Domain / CC0).</p>
  </footer>;
}

export function HomeExperienceV2({ profile = {}, medicineCount = null }: { profile?: Profile; medicineCount?: number | null }) {
  const [language, setLanguage] = useState<"en"|"bn">("en");
  const [tipIndex, setTipIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number|null>(0);
  useEffect(()=>{if(healthGuides.length>1)setTipIndex(Math.floor(Math.random()*healthGuides.length));},[]);
  const shop = profile.shop_name || "Shishu Medical Hall";
  const tip = healthGuides.length ? healthGuides[tipIndex % healthGuides.length] : null;
  const cards = [
    {no:"01",label:"MEDICINE REFERENCE",title:"Know the medicine. Understand the details.",body:"Look up brand names, generic ingredients, strengths and medicine references.",href:"/medicines",icon:Pill,tone:"medicine",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Pills.JPG?width=900",alt:"Close-up photograph of medicine pills"},
    {no:"02",label:"PHARMACEUTICAL SCIENCE",title:"From research bench to medicine pack.",body:"Explore how medicines are researched, formulated, manufactured and quality-checked.",href:"/pharma",icon:FlaskConical,tone:"science",image:"https://commons.wikimedia.org/wiki/Special:FilePath/A_pharmaceutical_laboratory_with_books_and_equipment_on_a_lo_Wellcome_V0029788.jpg?width=900",alt:"Pharmaceutical laboratory equipment"},
    {no:"03",label:"HEALTH KNOWLEDGE",title:"Everyday health, explained clearly.",body:"Practical guides to medicine labels, safe storage and health literacy.",href:"/health-library",icon:BookOpen,tone:"knowledge",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Laboratory_Microscope.jpg?width=900",alt:"Students studying through a laboratory microscope"}
  ];
  const faqs = [
    {q:"Is this an online pharmacy?",a:"No. Shishu Medical Hall is a local pharmacy website with medicine references and educational resources. It is not an online medicine marketplace."},
    {q:"Can I order medicine here?",a:"No online ordering or checkout is offered. Please visit the pharmacy and speak with the pharmacist about availability and appropriate guidance."},
    {q:"Where does medicine information come from?",a:"The medicine explorer links to MedEx Bangladesh as an external reference directory. Its catalogue is not represented as locally hosted data."},
    {q:"Is the health content medical advice?",a:"No. The material is general education only. It does not diagnose or prescribe. Consult a registered doctor or pharmacist for personal advice."}
  ];
  return <main className="s2-site">
    <SiteHeader shop={shop} language={language} onLanguage={()=>setLanguage(v=>v==="en"?"bn":"en")}/>
    <section className="s2-hero">
      <div className="s2-hero-copy">
        <span className="s2-eyebrow"><i/> YOUR LOCAL PHARMACY · MEDICINE & HEALTH INFORMATION</span>
        <h1>{language==="bn"?<>পরিচিত ফার্মেসি।<br/><em>স্বাস্থ্যকে জানুন আরও ভালোভাবে।</em></>:<>Care you know.<br/><em>Knowledge that goes further.</em></>}</h1>
        <p><b>{shop}</b> is a neighbourhood pharmacy. Explore medicine references, understand how the body works and learn the science behind modern healthcare.</p>
        <div className="s2-hero-actions"><Link href="/medicines" className="s2-primary">Explore medicines <ArrowUpRight size={17}/></Link><Link href="/bio-intelligent" className="s2-secondary">Enter Bio Intelligent <ArrowRight size={17}/></Link></div>
        <div className="s2-trust"><span><ShieldCheck size={16}/> Local pharmacy</span><span><BookOpen size={16}/> Clear health information</span></div>
      </div>
      <div className="s2-hero-image">
        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Human_heart.jpg?width=1100" alt="Three-dimensional anatomical model of the human heart" fetchPriority="high"/>
        <div className="s2-image-shade"/>
        <div className="s2-image-top"><span>ANATOMY / PLATE 001</span><span>HUMAN CARDIOVASCULAR SYSTEM</span></div>
        <div className="s2-image-bottom"><b>The human heart</b><span>Four chambers. One continuous rhythm.</span></div>
        <span className="s2-image-index">BIO INTELLIGENT · 01 / 04</span>
      </div>
    </section>

    <section className="s2-index"><div className="s2-index-intro"><span className="s2-kicker">THE KNOWLEDGE INDEX</span><p>A live snapshot of the learning resources and local catalogue.</p></div>
      <div><b>{medicineCount===null?"—":medicineCount.toLocaleString("en-BD")}</b><span>Locally indexed medicines</span><small>{medicineCount===null?"Count unavailable":"Local catalogue records"}</small></div>
      <div><b>{String(healthGuides.length).padStart(2,"0")}</b><span>Health Library guides</span><small>Published guides</small></div>
      <div><b>04</b><span>Bio Intelligent chapters</span><small>Guided learning</small></div>
    </section>

    {tip && <section className="s2-tip"><div className="s2-tip-mark"><BookOpen size={23}/></div><div className="s2-tip-content"><span className="s2-kicker">TODAY'S HEALTH READING</span><h2>{tip.title}</h2><p>{tip.intro}</p><Link href={"/health-library#"+tip.id}>Read this guide <ArrowUpRight size={15}/></Link></div><button onClick={()=>setTipIndex(i=>(i+1)%healthGuides.length)} disabled={healthGuides.length<2}>Another guide <ArrowRight size={15}/></button></section>}

    <section className="s2-discover">
      <div className="s2-section-head"><div><span className="s2-kicker">EXPLORE THE KNOWLEDGE SPACE</span><h2>Four ways to look<br/><em>closer at health.</em></h2></div><p>Start with a medicine reference, explore the science behind it or build a clearer understanding of everyday health.</p></div>
      <div className="s2-discover-list">{cards.map((card,i)=>{return <motion.article className={"s2-discover-card "+card.tone} key={card.no} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:i*.08}}><div className="s2-card-art s2-card-photo"><img src={card.image} alt={card.alt} loading="lazy"/><span>0{Number(card.no)} / FIELD NOTE</span></div><div className="s2-card-copy"><span className="s2-kicker">{card.label}</span><h3>{card.title}</h3><p>{card.body}</p><Link href={card.href}>Explore section <ArrowUpRight size={16}/></Link></div></motion.article>})}
        <motion.article className="s2-discover-card bio" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:.24}}><div className="s2-card-art s2-dna-art"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/3D_DNA.png?width=900" alt="Three-dimensional DNA double helix visualization" loading="lazy"/><span>04 / VISUAL BIOLOGY</span></div><div className="s2-card-copy"><span className="s2-kicker">VISUAL BIOLOGY / FOUR CHAPTERS</span><h3>Step inside the human body.</h3><p>Explore the heart, cells and DNA, pharmacology and the research behind new treatments.</p><Link href="/bio-intelligent">Discover Bio Intelligent <ArrowUpRight size={16}/></Link></div></motion.article>
      </div>
    </section>

    <MoleculeStudio/>

    <section className="s2-chapters"><div className="s2-section-head"><div><span className="s2-kicker">BIO INTELLIGENT / CHAPTER GUIDE</span><h2>Start with one system.<br/><em>Discover the connections.</em></h2></div><Link href="/bio-intelligent">Explore all chapters <ArrowUpRight size={16}/></Link></div>
      <div className="s2-chapter-grid">{chapters.map(ch=>{const Icon=ch.icon;return <Link href={"/bio-intelligent#"+ch.id} className={"s2-chapter "+ch.color} key={ch.id}><span className="s2-chapter-no">FIG. {ch.no}</span><div className="s2-chapter-icon"><img src={ch.image} alt={ch.alt} loading="lazy"/></div><span className="s2-kicker">{ch.category}</span><b>{ch.title}</b><p>{ch.description}</p><ArrowUpRight className="s2-chapter-arrow" size={17}/></Link>})}</div>
    </section>

    <section className="s2-faq"><div className="s2-faq-intro"><span className="s2-kicker">GOOD TO KNOW</span><h2>Clear answers.<br/><em>No confusion.</em></h2><p>A quick guide to what this website offers — and what it does not.</p></div><div className="s2-faq-list">{faqs.map((faq,i)=><article className={openFaq===i?"open":""} key={faq.q}><button onClick={()=>setOpenFaq(v=>v===i?null:i)} aria-expanded={openFaq===i}><span>0{i+1}</span><b>{faq.q}</b><ChevronDown size={18}/></button>{openFaq===i&&<p>{faq.a}</p>}</article>)}</div></section>
    <Footer profile={profile}/>
  </main>;
}
