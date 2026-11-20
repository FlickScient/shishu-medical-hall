"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, ArrowRight, ArrowUpRight, Atom, BookOpen, Brain, Dna,
  FlaskConical, HeartPulse, Menu, Microscope, Pill, ShieldCheck, X,
  MapPin, Phone, Clock3, ChevronDown, RotateCcw, RotateCw
} from "lucide-react";
import { healthGuides } from "@/lib/health-guides";

type Profile = {
  shop_name?: string; local_name?: string; tagline_bn?: string; tagline_en?: string;
  phone?: string; address?: string; doctor_name?: string; proprietor_name?: string;
};

const chapters = [
  { id: "heart", no: "01", title: "The heart", category: "CARDIOVASCULAR BIOLOGY", description: "The pump, the chambers and the rhythm behind every beat.", icon: HeartPulse, color: "rose", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Human_heart.jpg?width=900" },
  { id: "cells", no: "02", title: "Cells & DNA", category: "CELLULAR BIOLOGY", description: "The microscopic structures and instructions that make life possible.", icon: Dna, color: "violet", image: "https://commons.wikimedia.org/wiki/Special:FilePath/3D_DNA.png?width=900" },
  { id: "medicine", no: "03", title: "Medicines", category: "PHARMACOLOGY", description: "How active ingredients interact with living systems.", icon: FlaskConical, color: "blue", image: "" },
  { id: "research", no: "04", title: "Discovery", category: "DRUG DEVELOPMENT", description: "The evidence and research behind modern treatment.", icon: Microscope, color: "green", image: "" }
];

const molecules = [
  { id: "water", name: "Water", formula: "H₂O", type: "POLAR MOLECULE", fact: "Water's polarity helps it dissolve many substances and makes it essential for transport, temperature regulation and cellular processes.", atoms: [{x:50,y:50,z:0,t:"O"},{x:25,y:25,z:16,t:"H"},{x:75,y:25,z:-16,t:"H"}], bonds: [[0,1],[0,2]] },
  { id: "ammonia", name: "Ammonia", formula: "NH₃", type: "NITROGEN COMPOUND", fact: "Ammonia is a small nitrogen-containing molecule. Nitrogen is also essential to amino acids and nucleic acids.", atoms: [{x:50,y:48,z:0,t:"N"},{x:22,y:24,z:14,t:"H"},{x:78,y:24,z:-14,t:"H"},{x:50,y:83,z:4,t:"H"}], bonds: [[0,1],[0,2],[0,3]] },
  { id: "methane", name: "Methane", formula: "CH₄", type: "SIMPLE ORGANIC MOLECULE", fact: "Methane is the simplest alkane: one carbon atom bonded to four hydrogen atoms. Its tetrahedral geometry is a useful introduction to covalent bonding.", atoms: [{x:50,y:50,z:0,t:"C"},{x:50,y:12,z:20,t:"H"},{x:87,y:50,z:-12,t:"H"},{x:50,y:88,z:-20,t:"H"},{x:13,y:50,z:12,t:"H"}], bonds: [[0,1],[0,2],[0,3],[0,4]] }
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

function MoleculeStudio() {
  const [active, setActive] = useState("methane");
  const [rotation, setRotation] = useState({x: -12, y: 24});
  const [selected, setSelected] = useState<number | null>(null);
  const molecule = molecules.find(item => item.id === active) ?? molecules[2];
  const atomName = (symbol: string) => ({H:"Hydrogen",O:"Oxygen",N:"Nitrogen",C:"Carbon"} as Record<string,string>)[symbol] ?? symbol;
  return <section className="s2-molecule-section" id="molecular-observatory">
    <div className="s2-section-head"><div><span className="s2-kicker">INTERACTIVE SCIENCE / 002</span><h2>See how atoms<br/><em>hold together.</em></h2></div><p>Choose a molecule, turn the model and select an atom to learn what it contributes to the structure.</p></div>
    <div className="s2-molecule-studio">
      <div className="s2-molecule-stage">
        <div className="s2-stage-meta"><span>MOLECULAR STUDIO</span><span>MODEL / 0{molecules.findIndex(m=>m.id===active)+1}</span></div>
        <div className="s2-orbit s2-orbit-one"/><div className="s2-orbit s2-orbit-two"/>
        <div className="s2-molecule-object" style={{transform:`rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`}}>
          <svg viewBox="0 0 100 100" aria-label={molecule.name + " molecular model"}>
            <defs><radialGradient id="s2-h"><stop offset="0" stopColor="#fff"/><stop offset=".7" stopColor="#d8e7ec"/><stop offset="1" stopColor="#8faab7"/></radialGradient><radialGradient id="s2-c"><stop offset="0" stopColor="#8396a3"/><stop offset="1" stopColor="#233d51"/></radialGradient><radialGradient id="s2-o"><stop offset="0" stopColor="#ffb0a5"/><stop offset="1" stopColor="#b94750"/></radialGradient><radialGradient id="s2-n"><stop offset="0" stopColor="#b7b8ff"/><stop offset="1" stopColor="#5558a7"/></radialGradient></defs>
            {molecule.bonds.map(([a,b],i)=><g key={i}><line x1={molecule.atoms[a].x} y1={molecule.atoms[a].y} x2={molecule.atoms[b].x} y2={molecule.atoms[b].y} stroke="#9eb9c4" strokeWidth="5" strokeLinecap="round"/><line x1={molecule.atoms[a].x} y1={molecule.atoms[a].y-1} x2={molecule.atoms[b].x} y2={molecule.atoms[b].y-1} stroke="#e9f4f6" strokeWidth="1.3" strokeLinecap="round"/></g>)}
            {molecule.atoms.map((atom,i)=><g key={i} role="button" tabIndex={0} aria-label={`Explain ${atomName(atom.t)} atom`} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelected(i)}}} style={{cursor:"pointer"}}><circle cx={atom.x} cy={atom.y} r={atom.t==="H"?8.2:10.5} fill={`url(#s2-${atom.t.toLowerCase()})`} stroke="#ffffff" strokeWidth="1.2"/><text x={atom.x} y={atom.y+.4} textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="800" fill={atom.t==="H"?"#496274":"#fff"}>{atom.t}</text></g>)}
          </svg>
        </div>
        {selected !== null && <div className="s2-atom-note"><button onClick={()=>setSelected(null)} aria-label="Close atom details">×</button><b>{atomName(molecule.atoms[selected].t)} / {molecule.atoms[selected].t}</b><span>{molecule.atoms[selected].t==="H"?"Hydrogen usually forms one covalent bond.":molecule.atoms[selected].t==="O"?"Oxygen commonly forms two covalent bonds.":molecule.atoms[selected].t==="N"?"Nitrogen commonly forms three covalent bonds.":"Carbon commonly forms four covalent bonds."}</span></div>}
        <div className="s2-model-controls"><button aria-label="Rotate left" onClick={()=>setRotation(r=>({...r,y:r.y-35}))}><RotateCcw size={16}/></button><button onClick={()=>{setRotation({x:-12,y:24});setSelected(null)}}>RESET VIEW</button><button aria-label="Rotate right" onClick={()=>setRotation(r=>({...r,y:r.y+35}))}><RotateCw size={16}/></button></div>
        <span className="s2-stage-caption">CONCEPTUAL STRUCTURE / TAP AN ATOM</span>
      </div>
      <div className="s2-molecule-details"><span className="s2-kicker">CHOOSE A MOLECULE</span>
        <div className="s2-molecule-select">{molecules.map(item=><button key={item.id} className={active===item.id?"active":""} onClick={()=>{setActive(item.id);setRotation({x:-12,y:24});setSelected(null)}}><span>{item.formula}</span><b>{item.name}</b><ArrowUpRight size={14}/></button>)}</div>
        <div className="s2-molecule-description"><span>{molecule.type}</span><h3>{molecule.name} <small>{molecule.formula}</small></h3><p>{molecule.fact}</p></div>
        <div className="s2-molecule-legend"><span><i className="atom-carbon"/> Carbon</span><span><i className="atom-hydrogen"/> Hydrogen</span><span><i className="atom-oxygen"/> Oxygen</span><span><i className="atom-nitrogen"/> Nitrogen</span></div>
        <small className="s2-disclaimer">Simplified educational model. Geometry and proportions are illustrative, not a precision molecular simulation.</small>
      </div>
    </div>
  </section>;
}

function Footer({ profile }: { profile: Profile }) {
  return <footer className="s2-footer"><div className="s2-footer-main"><div><Link href="/" className="s2-brand"><img src="/logo.jpg" alt=""/><span><b>{profile.shop_name || "Shishu Medical Hall"}</b><small>{profile.local_name || "অর্জুন ডাক্তারের দোকান"}</small></span></Link><p>A local pharmacy, with clear information about medicines and the science of health.</p></div>
    <div className="s2-footer-links"><b>Explore</b><Link href="/medicines">Medicine directory</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></div>
    <div className="s2-footer-links"><b>Visit the pharmacy</b><span><MapPin size={14}/>{profile.address || "Visit our pharmacy"}</span><span><Phone size={14}/>{profile.phone || "Contact details coming soon"}</span><span><Clock3 size={14}/>Local pharmacy</span></div></div>
    <div className="s2-footer-bottom"><span>© {new Date().getFullYear()} {profile.shop_name || "Shishu Medical Hall"}</span><span>Educational information only · Not a diagnosis or prescription.</span></div>
    <p className="s2-image-credit">Anatomical heart image: Rayhana Alhour, CC0, via Wikimedia Commons. DNA image: Tim Tim, CC BY-SA, via Wikimedia Commons.</p>
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
    {no:"01",label:"MEDICINE REFERENCE",title:"Know the medicine. Understand the details.",body:"Look up brand names, generic ingredients, strengths and medicine references.",href:"/medicines",icon:Pill,tone:"medicine"},
    {no:"02",label:"PHARMACEUTICAL SCIENCE",title:"From research bench to medicine pack.",body:"Explore how medicines are researched, formulated, manufactured and quality-checked.",href:"/pharma",icon:FlaskConical,tone:"science"},
    {no:"03",label:"HEALTH KNOWLEDGE",title:"Everyday health, explained clearly.",body:"Practical guides to medicine labels, safe storage and health literacy.",href:"/health-library",icon:BookOpen,tone:"knowledge"}
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
      <div className="s2-discover-list">{cards.map((card,i)=>{const Icon=card.icon;return <motion.article className={"s2-discover-card "+card.tone} key={card.no} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:i*.08}}><div className="s2-card-art"><span>0{Number(card.no)} / FIELD NOTE</span><Icon size={48} strokeWidth={1.2}/></div><div className="s2-card-copy"><span className="s2-kicker">{card.label}</span><h3>{card.title}</h3><p>{card.body}</p><Link href={card.href}>Explore section <ArrowUpRight size={16}/></Link></div></motion.article>})}
        <motion.article className="s2-discover-card bio" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:.24}}><div className="s2-card-art s2-dna-art"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/3D_DNA.png?width=700" alt="Three-dimensional DNA double helix visualization" loading="lazy"/></div><div className="s2-card-copy"><span className="s2-kicker">VISUAL BIOLOGY / FOUR CHAPTERS</span><h3>Step inside the human body.</h3><p>Explore the heart, cells and DNA, pharmacology and the research behind new treatments.</p><Link href="/bio-intelligent">Discover Bio Intelligent <ArrowUpRight size={16}/></Link></div></motion.article>
      </div>
    </section>

    <MoleculeStudio/>

    <section className="s2-chapters"><div className="s2-section-head"><div><span className="s2-kicker">BIO INTELLIGENT / CHAPTER GUIDE</span><h2>Start with one system.<br/><em>Discover the connections.</em></h2></div><Link href="/bio-intelligent">Explore all chapters <ArrowUpRight size={16}/></Link></div>
      <div className="s2-chapter-grid">{chapters.map(ch=>{const Icon=ch.icon;return <Link href={"/bio-intelligent#"+ch.id} className={"s2-chapter "+ch.color} key={ch.id}><span className="s2-chapter-no">FIG. {ch.no}</span><div className="s2-chapter-icon">{ch.image?<img src={ch.image} alt="" loading="lazy"/>:<Icon size={42} strokeWidth={1.25}/>}</div><span className="s2-kicker">{ch.category}</span><b>{ch.title}</b><p>{ch.description}</p><ArrowUpRight className="s2-chapter-arrow" size={17}/></Link>})}</div>
    </section>

    <section className="s2-faq"><div className="s2-faq-intro"><span className="s2-kicker">GOOD TO KNOW</span><h2>Clear answers.<br/><em>No confusion.</em></h2><p>A quick guide to what this website offers — and what it does not.</p></div><div className="s2-faq-list">{faqs.map((faq,i)=><article className={openFaq===i?"open":""} key={faq.q}><button onClick={()=>setOpenFaq(v=>v===i?null:i)} aria-expanded={openFaq===i}><span>0{i+1}</span><b>{faq.q}</b><ChevronDown size={18}/></button>{openFaq===i&&<p>{faq.a}</p>}</article>)}</div></section>
    <Footer profile={profile}/>
  </main>;
}
