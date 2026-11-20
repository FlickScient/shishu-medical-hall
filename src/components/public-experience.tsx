"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { healthGuides } from "@/lib/health-guides";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Atom, BookOpen, BrainCircuit,
  ChevronDown, Dna, FlaskConical, HeartPulse, Menu, Microscope,
  Pill, ShieldCheck, Sparkles, X, MapPin, Phone, Clock3
} from "lucide-react";

type Profile = { shop_name?: string; local_name?: string; tagline_bn?: string; tagline_en?: string; phone?: string; address?: string; doctor_name?: string; proprietor_name?: string };
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: .11 } } };

function Header({ shop = "Shishu Medical Hall", language, onLanguageChange }: { shop?: string; language?: "en" | "bn"; onLanguageChange?: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className="px-header">
    <Link href="/" className="px-brand"><img src="/logo.jpg" alt="" /><span><b>{shop}</b><small>অর্জুন ডাক্তারের দোকান</small></span></Link>
    <nav className="px-nav"><Link href="/medicines">Medicines</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></nav>
    <div className="px-head-actions">{onLanguageChange && <button className="px-language-toggle" onClick={onLanguageChange} aria-label="Switch website language">{language === "bn" ? "EN" : "বাংলা"}</button>}<Link href="/dashboard" className="px-portal">Store portal <ArrowUpRight size={14}/></Link><button className="px-menu-button" aria-label="Open navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
    <AnimatePresence>{open && <motion.nav className="px-mobile-nav" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><Link onClick={()=>setOpen(false)} href="/medicines">Medicines</Link><Link onClick={()=>setOpen(false)} href="/pharma">Pharma & science</Link><Link onClick={()=>setOpen(false)} href="/bio-intelligent">Bio Intelligent</Link><Link onClick={()=>setOpen(false)} href="/health-library">Health library</Link><Link onClick={()=>setOpen(false)} href="/dashboard">Store portal</Link></motion.nav>}</AnimatePresence>
  </header>;
}

function HeartArtwork({ large = false }: { large?: boolean }) {
  const artworkId = useId().replace(/:/g, "");
  return <div className={large ? "px-heart-art px-heart-large" : "px-heart-art"} aria-label="Scientific illustration of the human heart">
    <div className="px-heart-grid" aria-hidden="true"/>
    <div className="px-heart-orbit px-orbit-a" aria-hidden="true"/>
    <div className="px-heart-orbit px-orbit-b" aria-hidden="true"/>
    <svg className="px-heart-svg px-anatomical-heart" viewBox="0 0 320 330" role="img" aria-label="Stylised anatomical heart with vessels and an ECG trace">
      <defs>
        <linearGradient id={`${artworkId}-body`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f48a91"/><stop offset=".48" stopColor="#cf5369"/><stop offset="1" stopColor="#873b60"/></linearGradient>
        <linearGradient id={`${artworkId}-vessel`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2a1a0"/><stop offset="1" stopColor="#b84d68"/></linearGradient>
        <linearGradient id={`${artworkId}-blue`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8bc5d5"/><stop offset="1" stopColor="#397e9e"/></linearGradient>
        <filter id={`${artworkId}-shadow`} x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      <ellipse cx="162" cy="279" rx="79" ry="18" fill="#426e8b" opacity=".16" filter={`url(#${artworkId}-shadow)`}/>
      <g className="px-heart-vessels" strokeLinecap="round" strokeLinejoin="round">
        <path d="M151 105 C139 69 132 36 147 17 C158 2 184 9 184 29 L184 91" fill="none" stroke={`url(#${artworkId}-vessel)`} strokeWidth="28"/>
        <path d="M177 93 C183 51 211 35 232 45 C251 54 248 78 231 90 L205 113" fill="none" stroke={`url(#${artworkId}-vessel)`} strokeWidth="20"/>
        <path d="M123 116 C102 88 83 77 67 86 C51 96 59 121 80 132 L111 151" fill="none" stroke={`url(#${artworkId}-blue)`} strokeWidth="23"/>
        <path d="M191 113 C214 91 239 93 251 109 C262 124 246 144 224 147 L203 154" fill="none" stroke={`url(#${artworkId}-blue)`} strokeWidth="16"/>
        <path d="M150 106 C143 76 143 56 151 38" fill="none" stroke="#ffd0c7" strokeWidth="5" opacity=".55"/>
      </g>
      <path className="px-heart-shape" d="M158 111 C135 82 99 94 91 127 C80 173 116 225 160 273 C201 232 246 180 236 137 C229 103 191 88 158 111Z" fill={`url(#${artworkId}-body)`} stroke="#a94b64" strokeWidth="3"/>
      <path d="M158 119 C143 151 144 199 160 269 C178 222 185 171 176 121" fill="none" stroke="#f9b0aa" strokeWidth="5" opacity=".65"/>
      <path d="M111 135 C123 119 143 119 154 133 M190 126 C210 122 224 137 222 155" fill="none" stroke="#ffd4cd" strokeWidth="5" opacity=".65" strokeLinecap="round"/>
      <path d="M160 155 C147 176 135 192 123 206 M178 158 C190 177 205 193 218 207" fill="none" stroke="#8f3e5a" strokeWidth="7" opacity=".58" strokeLinecap="round"/>
      <path d="M35 173 H103 L120 154 L137 198 L156 129 L176 174 H284" className="px-heart-ecg" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity=".92"/>
      <path d="M158 273 L151 292 M158 273 L169 291" stroke="#a94b64" strokeWidth="5" strokeLinecap="round"/>
    </svg>
    <span className="px-heart-label px-label-one"><i/> CARDIOVASCULAR SYSTEM</span>
    <span className="px-heart-label px-label-two"><Activity size={13}/> HEART / 01</span>
    <span className="px-heart-index">ANATOMY STUDY / HUMAN BIOLOGY</span>
  </div>;
}

function PulseDock() {
  const [open,setOpen] = useState(false);
  return <div className="px-pulse-dock">
    <AnimatePresence>
      {open && <motion.div className="px-pulse-panel" initial={{opacity:0,y:14,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:.97}} transition={{duration:.2}}>
        <div className="px-pulse-panel-top"><span>THE PULSE / QUICK ACCESS</span><button onClick={()=>setOpen(false)} aria-label="Close quick access"><X size={16}/></button></div>
        <div className="px-pulse-panel-intro"><span className="px-pulse-mini"><HeartPulse size={22}/></span><div><b>Curiosity, one heartbeat away.</b><small>Choose where to explore next.</small></div></div>
        <Link href="/bio-intelligent" onClick={()=>setOpen(false)}><span><HeartPulse size={16}/></span><div><b>Bio Intelligent</b><small>Explore the human body</small></div><ArrowUpRight size={15}/></Link>
        <Link href="/medicines" onClick={()=>setOpen(false)}><span><Pill size={16}/></span><div><b>Medicine reference</b><small>Search medicine information</small></div><ArrowUpRight size={15}/></Link>
        <Link href="/health-library" onClick={()=>setOpen(false)}><span><BookOpen size={16}/></span><div><b>Health library</b><small>Learn with clarity</small></div><ArrowUpRight size={15}/></Link>
      </motion.div>}
    </AnimatePresence>
    <button className={"px-pulse-trigger "+(open?"is-open":"")} onClick={()=>setOpen(!open)} aria-label={open?"Close The Pulse":"Open The Pulse quick access"} aria-expanded={open}>
      <span className="px-pulse-ripple"/><HeartPulse size={23}/><span className="px-pulse-trigger-label">THE PULSE</span>
    </button>
  </div>;
}

const molecules = [
  {id:"water",name:"Water",formula:"H₂O",type:"POLAR MOLECULE",fact:"Water's polarity helps it dissolve many substances and makes it essential to transport, temperature regulation and countless cellular processes.",atoms:[{x:50,y:52,t:"O"},{x:25,y:27,t:"H"},{x:76,y:27,t:"H"}],bonds:[[0,1],[0,2]]},
  {id:"ammonia",name:"Ammonia",formula:"NH₃",type:"NITROGEN COMPOUND",fact:"Ammonia is a small nitrogen-containing molecule. In biology, nitrogen compounds are essential building blocks for amino acids and nucleic acids.",atoms:[{x:50,y:49,t:"N"},{x:22,y:22,t:"H"},{x:78,y:22,t:"H"},{x:50,y:82,t:"H"}],bonds:[[0,1],[0,2],[0,3]]},
  {id:"methane",name:"Methane",formula:"CH₄",type:"SIMPLE ORGANIC MOLECULE",fact:"Methane is the simplest alkane: one carbon atom bonded to four hydrogen atoms. It is a useful example for understanding covalent bonding and molecular geometry.",atoms:[{x:50,y:50,t:"C"},{x:50,y:13,t:"H"},{x:87,y:50,t:"H"},{x:50,y:87,t:"H"},{x:13,y:50,t:"H"}],bonds:[[0,1],[0,2],[0,3],[0,4]]}
];

function MoleculeObservatory() {
  const [active,setActive] = useState("water");
  const [turn,setTurn] = useState(0);
  const [atomInfo,setAtomInfo] = useState<number | null>(null);
  const molecule = molecules.find(item=>item.id===active)!;
  return <section className="px-molecule-section">
    <div className="px-molecule-heading"><div><span className="px-kicker">THE MOLECULAR OBSERVATORY / INTERACTIVE</span><h2>Small things.<br/><em>Extraordinary connections.</em></h2></div><p>Explore simple molecular models. Switch molecules and rotate the view to get a feel for how atoms connect.</p></div>
    <div className="px-molecule-console">
      <div className="px-molecule-visual">
        <div className="px-molecule-visual-top"><span>MOLECULAR VIEWER / 3D-INSPIRED SCHEMATIC</span><span>MODEL 0{molecules.findIndex(item=>item.id===active)+1}</span></div>
        <div className="px-molecule-model" style={{transform:"rotate("+turn+"deg)"}}>
          <svg viewBox="0 0 100 100" role="img" aria-label={molecule.name+" conceptual molecular model"}>
            {molecule.bonds.map(([a,b],i)=><line key={i} x1={molecule.atoms[a].x} y1={molecule.atoms[a].y} x2={molecule.atoms[b].x} y2={molecule.atoms[b].y} stroke="#8bbdca" strokeWidth="2.2" strokeLinecap="round"/>)}
            {molecule.atoms.map((atom,i)=><g key={i} role="button" tabIndex={0} aria-label={"Explain "+atom.t+" atom"} onClick={()=>setAtomInfo(i)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setAtomInfo(i)}}} style={{cursor:"pointer"}}><circle cx={atom.x} cy={atom.y} r="8.5" fill={atom.t==="O"?"#42aeb6":atom.t==="N"?"#858ac7":atom.t==="C"?"#45657d":"#f8ffff"} stroke={atom.t==="H"?"#91bdc9":"#ffffff"} strokeWidth="1.3"/><text x={atom.x} y={atom.y+.1} textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="700" fill={atom.t==="H"?"#416b7d":"#ffffff"}>{atom.t}</text></g>)}
          </svg>
        </div>{atomInfo!==null && <div className="px-atom-tooltip" role="status"><button onClick={()=>setAtomInfo(null)} aria-label="Close atom explanation">×</button><b>{molecule.atoms[atomInfo].t} = {({H:"Hydrogen",O:"Oxygen",N:"Nitrogen",C:"Carbon"} as Record<string,string>)[molecule.atoms[atomInfo].t]}</b><span>{molecule.atoms[atomInfo].t==="O"?"Oxygen typically forms 2 covalent bonds.":molecule.atoms[atomInfo].t==="H"?"Hydrogen typically forms 1 covalent bond.":molecule.atoms[atomInfo].t==="N"?"Nitrogen commonly forms 3 covalent bonds.":"Carbon commonly forms 4 covalent bonds."}</span></div>}<div className="px-molecule-controls"><button onClick={()=>setTurn(turn-45)} aria-label="Rotate molecule left">↶</button><button onClick={()=>setTurn(0)}>RESET VIEW</button><button onClick={()=>setTurn(turn+45)} aria-label="Rotate molecule right">↷</button></div>
        <span className="px-molecule-orbit-label">ATOMIC CONNECTIONS / {molecule.atoms.length} ATOMS</span>
      </div>
      <div className="px-molecule-info"><span className="px-kicker">SELECT A MODEL</span><div className="px-molecule-tabs">{molecules.map(item=><button key={item.id} className={active===item.id?"active":""} onClick={()=>{setActive(item.id);setTurn(0);setAtomInfo(null)}}><span>{item.formula}</span><b>{item.name}</b><ArrowUpRight size={14}/></button>)}</div><div className="px-molecule-detail"><span>{molecule.type}</span><h3>{molecule.name} <small>{molecule.formula}</small></h3><p>{molecule.fact}</p></div><div className="px-model-note"><Atom size={15}/> Simplified educational model. Not to scale and not a precise chemical structure.</div></div>
    </div>
  </section>;
}

function Footer({ profile }: { profile?: Profile }) {
  return <footer className="px-footer"><div className="px-footer-top"><div><Link href="/" className="px-brand"><img src="/logo.jpg" alt=""/><span><b>{profile?.shop_name || "Shishu Medical Hall"}</b><small>{profile?.local_name || "অর্জুন ডাক্তারের দোকান"}</small></span></Link><p>A neighbourhood pharmacy with a space for better understanding of medicines, health and science.</p></div><div className="px-footer-links"><b>Explore</b><Link href="/medicines">Medicine directory</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></div><div className="px-footer-links"><b>Contact</b><span><MapPin size={14}/>{profile?.address || "Visit our pharmacy"}</span><span><Phone size={14}/>{profile?.phone || "Contact details coming soon"}</span><span><Clock3 size={14}/>Local pharmacy</span></div></div><div className="px-footer-bottom"><span>© {new Date().getFullYear()} {profile?.shop_name || "Shishu Medical Hall"}</span><span>Medicine information is educational and does not replace professional advice.</span></div></footer>;
}

export function HomeExperience({ profile = {}, medicineCount = null }: { profile?: Profile; medicineCount?: number | null }) {
  const [language,setLanguage] = useState<"en"|"bn">("en");
  const [tipIndex,setTipIndex] = useState(0);
  const [openFaq,setOpenFaq] = useState<number|null>(0);
  useEffect(()=>{if(healthGuides.length>1)setTipIndex(Math.floor(Math.random()*healthGuides.length));},[]);
  const shop = profile.shop_name || "Shishu Medical Hall";
  const healthGuideCount = healthGuides.length;
  const healthTip = healthGuides.length ? healthGuides[tipIndex % healthGuides.length] : null;
  const bioChapterCount = chapters.length;
  const cards = [
    {n:"01",icon:Pill,kicker:"MEDICINE REFERENCE",title:"Know what goes into your medicine.",body:"Explore brand names, generic ingredients, strengths and useful medicine references.",href:"/medicines",tone:"blue"},
    {n:"02",icon:FlaskConical,kicker:"PHARMACEUTICAL SCIENCE",title:"Behind every tablet is a story.",body:"Discover how medicines are researched, developed, manufactured and quality-checked.",href:"/pharma",tone:"mint"},
    {n:"03",icon:BookOpen,kicker:"HEALTH KNOWLEDGE",title:"Understand health, one idea at a time.",body:"Practical explainers on medicine labels, safe storage and everyday health literacy.",href:"/health-library",tone:"lilac"}
  ];
  return <main className="px-site">
    <Header shop={shop} language={language} onLanguageChange={()=>setLanguage(language==="en"?"bn":"en")}/>
    <section className="px-home-hero">
      <div className="px-hero-copy">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={reveal} className="px-eyebrow"><i/> {language==="bn"?"আপনার পরিচিত ফার্মেসি · জ্ঞানের নতুন দিগন্ত":"YOUR LOCAL PHARMACY · MEDICINE & HEALTH INFORMATION"}</motion.div>
          <motion.h1 variants={reveal}>{language==="bn"?<>যত্নের পরিচয়।<br/><em>জ্ঞানে এগিয়ে চলি।</em></>:<>A familiar pharmacy.<br/><em>A clearer view of health.</em></>}</motion.h1>
          <motion.p variants={reveal}>{language==="bn"?<><b>{shop}</b>-এ স্বাগতম — ওষুধ, মানবদেহ এবং স্বাস্থ্যবিজ্ঞানের বিষয়গুলো সহজভাবে জানার একটি পরিচিত ঠিকানা।</>:<><b>{shop}</b> is here for everyday pharmacy needs. This site helps you look up medicines and understand the science behind health.</>}</motion.p>
          <motion.div variants={reveal} className="px-hero-buttons"><Link className="px-button-primary" href="/medicines">{language==="bn"?"ওষুধ সম্পর্কে জানুন":"Explore medicines"} <ArrowUpRight size={16}/></Link><Link className="px-button-text" href="/bio-intelligent">{language==="bn"?"বায়ো ইন্টেলিজেন্ট দেখুন":"Discover Bio Intelligent"} <ArrowRight size={15}/></Link></motion.div>
          <motion.div variants={reveal} className="px-hero-proof"><span><ShieldCheck size={15}/> Local pharmacy</span><i/><span><BookOpen size={15}/> Clear information</span></motion.div>
        </motion.div>
      </div>
      <motion.div className="px-hero-visual" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{duration:1,ease}}>
        <div className="px-visual-caption"><span>SHISHU / BIO INTELLIGENT</span><span>01 — 04</span></div><HeartArtwork large/><div className="px-visual-foot"><span>THE HUMAN SYSTEM</span><span>SCIENCE · CARE · DISCOVERY</span></div>
      </motion.div>
      <div className="px-hero-side-note">A LITTLE CLOSER TO THE SCIENCE OF YOU <ArrowDownRight size={15}/></div>
    </section>
    
    <section className="px-live-strip" aria-label="Live content and medicine counts">
      <div className="px-live-strip-heading"><span className="px-kicker">THE KNOWLEDGE INDEX</span><p>Real counts from the published guides, Bio Intelligent chapters and local medicine database.</p></div>
      <div className="px-live-stat"><b>{medicineCount === null ? "—" : medicineCount.toLocaleString("en-BD")}</b><small>Locally indexed medicines</small><em>{medicineCount === null ? "Count unavailable" : medicineCount === 0 ? "No local records yet" : "Local catalogue records"}</em></div>
      <div className="px-live-stat"><b>{healthGuideCount.toString().padStart(2,"0")}</b><small>Health Library guides</small><em>Published guides</em></div>
      <div className="px-live-stat"><b>{bioChapterCount.toString().padStart(2,"0")}</b><small>Bio Intelligent chapters</small><em>Guided chapters</em></div>
      <p className="px-live-strip-note">MedEx Bangladesh is linked as an external reference directory; its catalogue is not counted as locally hosted medicine data.</p>
    </section>
    {healthTip && <section className="px-today-tip">
      <div className="px-tip-icon"><BookOpen size={22}/></div>
      <div className="px-tip-copy"><span className="px-kicker">FROM THE HEALTH LIBRARY</span><h2>{healthTip.title}</h2><p>{healthTip.intro}</p><small>{healthTip.items?.[0] || "Explore the full guide for more context."}</small><Link href={"/health-library#"+healthTip.id}>Read the guide <ArrowUpRight size={14}/></Link></div>
      <button className="px-tip-next" onClick={()=>setTipIndex((tipIndex+1)%healthGuides.length)} aria-label="Show another health tip" disabled={healthGuides.length<2}>Another tip <ArrowRight size={15}/></button>
    </section>}
    <section className="px-discover-section">
      <motion.div className="px-section-heading" initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} variants={stagger}><motion.div variants={reveal}><span className="px-kicker">EXPLORE THE KNOWLEDGE SPACE</span><h2>More than a pharmacy.<br/><em>A place to discover.</em></h2></motion.div><motion.p variants={reveal}>A carefully organised starting point for medicine references, pharmaceutical science and clear, useful health knowledge.</motion.p></motion.div>
      <div className="px-discover-grid">{cards.map((c,i)=><motion.div key={c.n} className={"px-discover-card "+c.tone} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.65,delay:i*.1,ease}}><div className="px-discover-top"><span>{c.n} / EXPLORE</span><c.icon size={21}/></div><small>{c.kicker}</small><h3>{c.title}</h3><p>{c.body}</p><Link href={c.href}>Explore section <ArrowUpRight size={15}/></Link></motion.div>)}</div>
    </section>
    <MoleculeObservatory/>
    <section className="px-bio-feature">
      <motion.div className="px-bio-art-wrap" initial={{opacity:0,x:-25}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.25}} transition={{duration:.8,ease}}><HeartArtwork/><div className="px-art-side-caption">BIO / 001<br/>THE HUMAN BODY</div></motion.div>
      <motion.div className="px-bio-feature-copy" initial={{opacity:0,x:25}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.25}} transition={{duration:.8,ease}}><span className="px-kicker">THE FEATURED EXPERIENCE</span><h2>Meet your body.<br/><em>Understand its wonder.</em></h2><p>Bio Intelligent is a visual learning space where biology meets medicine. Explore the heart, cells, DNA, the way medicines work and the research that moves healthcare forward.</p><div className="px-feature-tags"><span><HeartPulse size={14}/> Human systems</span><span><Dna size={14}/> Cells & DNA</span><span><Microscope size={14}/> Research</span></div><Link href="/bio-intelligent" className="px-button-primary">Enter Bio Intelligent <ArrowUpRight size={16}/></Link></motion.div>
    </section>
    <section className="px-chapter-preview">
      <div className="px-chapter-preview-heading"><div><span className="px-kicker">BIO INTELLIGENT / FOUR CHAPTERS</span><h2>A little preview.<br/><em>A deeper world inside.</em></h2></div><Link href="/bio-intelligent">Explore all chapters <ArrowUpRight size={15}/></Link></div>
      <div className="px-chapter-preview-track">{chapters.map(ch=>{const ChapterIcon=ch.icon;return <Link href={"/bio-intelligent#"+ch.id} className={"px-chapter-thumb "+ch.accent} key={ch.id}><span className="px-chapter-thumb-art"><ChapterIcon size={38} strokeWidth={1.25}/><small>FIG. {ch.no}</small></span><span className="px-kicker">CHAPTER {ch.no}</span><b>{ch.label}</b><small>{ch.sub}</small><ArrowUpRight size={15}/></Link>})}</div>
    </section>
    <section className="px-principles"><div className="px-principles-title"><span className="px-kicker">OUR APPROACH</span><h2>Familiar care.<br/><em>Thoughtful knowledge.</em></h2></div><div className="px-principle"><span>01</span><div><b>Rooted in the community</b><p>A familiar local pharmacy, built around everyday needs and trust.</p></div></div><div className="px-principle"><span>02</span><div><b>Information with context</b><p>Clear learning resources that help make complex topics easier to understand.</p></div></div><div className="px-principle"><span>03</span><div><b>Curiosity without confusion</b><p>Explore science in a structured way, without replacing professional advice.</p></div></div></section>
    <section className="px-faq-section">
      <div className="px-faq-heading"><span className="px-kicker">GOOD TO KNOW</span><h2>Questions, answered.<br/><em>Care without confusion.</em></h2><p>A quick note about what this pharmacy website is — and what it isn't.</p></div>
      <div className="px-faq-list">
        {[{q:"Is this an online pharmacy?",a:"No. Shishu Medical Hall is a neighbourhood pharmacy website with educational resources and a private store-management portal. It is not an online medicine marketplace."},{q:"Can I order medicine here?",a:"No online ordering or checkout is offered on this website. Please visit the pharmacy and speak with the pharmacist about medicine availability and appropriate guidance."},{q:"Where does the medicine information come from?",a:"The medicine explorer links to MedEx Bangladesh directories. Medicine records are not currently imported or hosted in this website."},{q:"Can I use the health guides as medical advice?",a:"No. The guides are general education only. They do not diagnose or prescribe. Follow the product label and consult a registered doctor or pharmacist for personal advice."}].map((item,i)=><article className={"px-faq-item "+(openFaq===i?"open":"")} key={item.q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}><span>0{i+1}</span><b>{item.q}</b><ChevronDown size={17}/></button>{openFaq===i&&<p>{item.a}</p>}</article>)}
      </div>
    </section>
    <section className="px-contact-cta"><div><span className="px-kicker">SHISHU MEDICAL HALL</span><h2>Your neighbourhood pharmacy.<br/><em>Always a little more to learn.</em></h2></div><div><p>{profile.tagline_en || "A familiar address for everyday healthcare."}</p><Link href="/dashboard">Store management <ArrowUpRight size={15}/></Link></div></section>
    <Footer profile={profile}/>
    <PulseDock/>
  </main>;
}

const chapters = [
  {id:"heart",no:"01",label:"The heart",title:"A rhythm that keeps us alive.",sub:"CARDIOVASCULAR BIOLOGY",intro:"The heart is a muscular pump with four chambers. Its coordinated contractions keep blood moving through the lungs and the rest of the body.",facts:["Four chambers work in a coordinated cycle.","Valves help blood flow in one direction.","Electrical signals coordinate each heartbeat."],stat:"≈ 100,000",unit:"beats each day · approximate",icon:HeartPulse,accent:"coral"},
  {id:"cells",no:"02",label:"Cells & DNA",title:"Life, written in microscopic detail.",sub:"CELLULAR BIOLOGY",intro:"Cells are the basic living units of the body. DNA stores biological instructions that help cells build and maintain the structures they need.",facts:["The cell membrane regulates exchange.","DNA is organised into chromosomes.","Genes contain instructions for functional products."],stat:"TRILLIONS",unit:"of cells in the human body",icon:Dna,accent:"violet"},
  {id:"medicine",no:"03",label:"Medicines",title:"How molecules make a difference.",sub:"PHARMACOLOGY",intro:"Medicines interact with biological systems in different ways — by binding receptors, changing enzyme activity, replacing substances or acting against microbes.",facts:["The active ingredient produces the intended effect.","Dose and formulation influence how a medicine is used.","Benefits and risks depend on the person and situation."],stat:"01 → MANY",unit:"brands can share one generic ingredient",icon:FlaskConical,accent:"cyan"},
  {id:"research",no:"04",label:"Discovery",title:"From a scientific idea to a treatment.",sub:"DRUG DEVELOPMENT",intro:"A potential medicine moves through laboratory research, carefully designed clinical studies, regulatory review and ongoing safety monitoring.",facts:["Preclinical work studies a candidate before human trials.","Clinical trials evaluate safety and benefit in people.","Monitoring continues after a medicine is approved."],stat:"ONGOING",unit:"research does not stop at approval",icon:Microscope,accent:"green"}
];


const organAtlas = [
  {id:"brain",name:"Brain",system:"NERVOUS SYSTEM",tag:"CONTROL CENTRE",position:{left:"50%",top:"18%"},role:"The brain receives information, processes it and coordinates movement, sensation, memory, language and many automatic body functions.",facts:[["≈ 86B","neurons · estimated"],["24/7","electrical activity"],["3","major regions explored"]],path:"M50 13 C35 5 22 15 27 29 C15 37 22 53 34 55 C40 69 59 68 65 56 C81 54 85 39 73 30 C78 15 61 6 50 13Z",detail:"Billions of nerve cells communicate through electrical and chemical signals. The cerebrum supports conscious thought and movement; the cerebellum helps coordinate balance; the brainstem manages essential automatic functions."},
  {id:"heart",name:"Heart",system:"CARDIOVASCULAR SYSTEM",tag:"THE PUMP",position:{left:"47%",top:"43%"},role:"A muscular pump that keeps blood moving through the lungs and the rest of the body, delivering oxygen and nutrients.",facts:[["4","chambers"],["≈ 100K","beats per day"],["2","circuits · pulmonary & systemic"]],path:"M50 18 C34 -1 10 12 14 35 C17 54 39 76 50 88 C64 73 86 52 87 34 C89 12 66 0 50 18Z",detail:"The right side sends blood to the lungs for gas exchange. The left side sends oxygen-rich blood around the body. Valves help keep blood flowing in the correct direction."},
  {id:"lungs",name:"Lungs",system:"RESPIRATORY SYSTEM",tag:"GAS EXCHANGE",position:{left:"53%",top:"31%"},role:"Two branching, elastic organs where oxygen enters the blood and carbon dioxide leaves it during breathing.",facts:[["2","lungs"],["Millions","of alveoli"],["O₂ / CO₂","gas exchange"]],path:"M48 12 C28 5 14 20 13 43 C10 66 23 82 42 76 C49 72 49 52 50 39 C51 52 51 72 58 76 C77 82 90 66 87 43 C86 20 72 5 52 12Z",detail:"Air travels through the trachea, bronchi and smaller bronchioles to tiny air sacs called alveoli. Their thin walls allow oxygen and carbon dioxide to diffuse between air and blood."},
  {id:"liver",name:"Liver",system:"DIGESTIVE & METABOLIC SYSTEM",tag:"CHEMICAL PROCESSING",position:{left:"58%",top:"54%"},role:"A large metabolic organ that processes nutrients, makes bile, stores energy and helps break down many substances.",facts:[["500+","known functions"],["Bile","supports digestion"],["Glucose","energy storage"]],path:"M12 30 C26 10 64 10 88 26 C93 36 82 61 67 68 C45 78 20 68 11 53 C6 44 7 36 12 30Z",detail:"The liver receives nutrient-rich blood from the digestive tract. It helps regulate blood chemistry, stores glycogen, produces important proteins and makes bile that supports fat digestion."},
  {id:"stomach",name:"Stomach",system:"DIGESTIVE SYSTEM",tag:"FOOD BREAKDOWN",position:{left:"55%",top:"63%"},role:"A muscular, expandable organ that stores food briefly and mixes it with acid and digestive enzymes.",facts:[["pH 1–3","typical acidic range"],["Chyme","partly digested food"],["Muscle","mixing contractions"]],path:"M47 9 C29 6 25 22 32 35 C38 47 25 54 20 65 C14 79 29 88 45 79 C60 70 63 57 75 51 C90 43 87 24 73 20 C63 17 58 10 47 9Z",detail:"The stomach's muscular wall churns food into a semi-liquid mixture. Acid helps create an environment for digestive enzymes, while mucus protects the stomach lining."},
  {id:"kidneys",name:"Kidneys",system:"URINARY SYSTEM",tag:"FILTER & BALANCE",position:{left:"44%",top:"66%"},role:"A pair of organs that filter blood, remove wastes into urine and regulate fluid, electrolyte and acid-base balance.",facts:[["≈ 1M","nephrons per kidney"],["24/7","filtration"],["Fluid","& salt balance"]],path:"M30 12 C9 12 8 40 17 57 C25 72 42 67 47 51 C52 36 47 16 30 12Z",detail:"Each kidney contains many nephrons. These microscopic filtering units adjust what stays in the blood and what leaves as urine. The kidneys also help regulate blood pressure and red blood cell production."},
  {id:"intestines",name:"Intestines",system:"DIGESTIVE SYSTEM",tag:"ABSORB & SUPPLY",position:{left:"54%",top:"76%"},role:"The small intestine absorbs most nutrients; the large intestine absorbs water and helps form stool.",facts:[["≈ 6 m","small intestine · adult"],["Villi","increase surface area"],["Microbiome","living gut ecosystem"]],path:"M18 17 C18 6 38 5 38 17 L38 28 C38 38 62 38 62 28 L62 17 C62 5 82 6 82 17 L82 32 C82 44 62 44 62 55 L62 67 C62 80 38 80 38 67 L38 55 C38 44 18 44 18 32Z",detail:"The small intestine uses folds and villi to create a large surface for nutrient absorption. The large intestine reabsorbs water and houses a complex community of microbes."},
  {id:"pancreas",name:"Pancreas",system:"DIGESTIVE & ENDOCRINE SYSTEM",tag:"ENZYMES & HORMONES",position:{left:"50%",top:"59%"},role:"A gland behind the stomach that releases digestive enzymes and hormones that help regulate blood glucose.",facts:[["2 roles","digestive & endocrine"],["Insulin","helps lower blood glucose"],["Enzymes","digest fats, proteins & carbs"]],path:"M12 48 C22 32 34 40 43 34 C56 25 64 31 73 27 C86 20 93 35 83 44 C72 53 59 49 50 58 C38 70 25 66 17 61 C10 58 8 54 12 48Z",detail:"The pancreas releases digestive enzymes into the small intestine. It also releases hormones—including insulin and glucagon—into the blood to help regulate blood glucose."},
  {id:"spleen",name:"Spleen",system:"LYMPHATIC & IMMUNE SYSTEM",tag:"BLOOD FILTER",position:{left:"39%",top:"55%"},role:"An organ in the upper left abdomen that filters blood, removes worn-out red blood cells and supports immune responses.",facts:[["Blood","filters circulating cells"],["Immune","helps detect pathogens"],["Left side","upper abdomen"]],path:"M50 9 C28 9 14 27 18 51 C21 72 37 89 51 88 C67 85 82 63 80 40 C78 20 65 9 50 9Z",detail:"The spleen monitors blood, helps remove old or damaged red blood cells and supports immune defence by helping immune cells respond to microbes in the bloodstream."},
  {id:"bladder",name:"Bladder",system:"URINARY SYSTEM",tag:"URINE STORAGE",position:{left:"50%",top:"86%"},role:"A hollow muscular organ that stores urine from the kidneys until it is released during urination.",facts:[["Stretchable","muscular wall"],["Urine","temporary storage"],["Signals","help control emptying"]],path:"M50 12 C32 12 19 27 22 47 C24 64 36 78 50 84 C64 78 76 64 78 47 C81 27 68 12 50 12Z",detail:"Urine travels from each kidney through a ureter into the bladder. As the bladder fills, stretch receptors signal the nervous system; coordinated muscle activity allows urine to pass through the urethra."})
];

const organFlow: Record<string, [string,string,string]> = {
 brain:["Sensory input","Neural processing","Response"],
 heart:["Body tissues","Lung circulation","Body circulation"],
 lungs:["Inhaled air","Alveolar exchange","Exhaled air"],
 liver:["Nutrients arrive","Metabolic processing","Bile & proteins"],
 stomach:["Food enters","Mixing & enzymes","Chyme"],
 kidneys:["Blood arrives","Nephron filtering","Urine"],
 intestines:["Digestion","Nutrient absorption","Waste"],
 pancreas:["Digestive enzymes","Hormone release","Glucose balance"],
 spleen:["Blood enters","Cell screening","Immune response"],
 bladder:["Kidneys","Urine storage","Release"]
};

function OrganAtlas() {
  const [selected,setSelected]=useState("heart");
  const [showDetail,setShowDetail]=useState(false);
  const organ=organAtlas.find(item=>item.id===selected)!;
  return <section className="organ-atlas" id="organs">
    <div className="organ-atlas-heading"><div><span className="px-kicker">THE HUMAN BODY / INTERACTIVE ANATOMY</span><h2>Ten windows.<br/><em>One living system.</em></h2></div><p>Select an organ on the body map or use the organ index. Each selection opens a visual anatomy card with its role, key structures and connected body systems.</p></div>
    <div className="organ-atlas-console">
      <div className="organ-body-stage">
        <div className="organ-stage-meta"><span>ANATOMICAL SCAN / FRONT VIEW</span><span>FIG. 01 — 10</span></div>
        <div className="organ-body-orbit orbit-a"/><div className="organ-body-orbit orbit-b"/>
        <svg className="organ-body-silhouette" viewBox="0 0 300 620" role="img" aria-label="Interactive front-view map of major human organs">
          <defs>
            <linearGradient id="body-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dbe9e7"/><stop offset=".48" stopColor="#9bbdbd"/><stop offset="1" stopColor="#557c8a"/></linearGradient>
            <linearGradient id="organ-core" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4b1a0"/><stop offset=".55" stopColor="#d66d76"/><stop offset="1" stopColor="#87485f"/></linearGradient>
            <filter id="body-depth"><feGaussianBlur stdDeviation="7"/></filter>
          </defs>
          <ellipse cx="150" cy="595" rx="73" ry="12" fill="#183b4b" opacity=".12" filter="url(#body-depth)"/>
          <path d="M150 23 C122 23 105 44 107 72 C109 95 123 111 150 112 C177 111 191 95 193 72 C195 44 178 23 150 23Z" fill="url(#body-shell)" opacity=".48" stroke="#77a1a4" strokeWidth="2"/><path d="M123 60 C116 42 134 33 145 43 C151 32 170 37 175 50 C185 57 178 75 164 77 C155 89 138 82 135 74 C124 75 117 68 123 60Z" fill="#8db8bc" opacity=".78" stroke="#c3e4d9" strokeWidth="1.5"/><path d="M130 49 Q139 41 144 53 T158 50 T173 57 M129 63 Q140 57 145 68 T160 65 T172 68" fill="none" stroke="#d6ebe1" strokeWidth="2" opacity=".75"/>
          <path d="M107 125 C82 129 63 148 58 180 L38 279 C35 296 44 304 53 299 C61 296 63 281 68 264 L88 199 L91 317 C92 348 101 378 106 409 L93 555 C91 576 104 583 113 568 L145 424 L155 424 L187 568 C196 583 209 576 207 555 L194 409 C199 378 208 348 209 317 L212 199 L232 264 C237 281 239 296 247 299 C256 304 265 296 262 279 L242 180 C237 148 218 129 193 125 C179 119 166 116 150 116 C134 116 121 119 107 125Z" fill="url(#body-shell)" opacity=".22" stroke="#86aeb0" strokeWidth="2"/>
          <path d="M150 115 L150 415" stroke="#a9ceca" strokeWidth="1.2" strokeDasharray="3 7" opacity=".8"/>
          <path d="M150 126 C126 131 111 152 114 184 C117 210 131 222 147 221 L147 171 C148 154 149 138 150 126Z" fill="#7cb2ba" opacity=".32"/>
          <path d="M150 126 C174 131 189 152 186 184 C183 210 169 222 153 221 L153 171 C152 154 151 138 150 126Z" fill="#7cb2ba" opacity=".32"/>
          <path d="M127 150 C111 140 97 153 101 180 C104 204 119 218 139 213 C147 195 142 166 127 150Z" fill="#b8757c" opacity=".9" stroke="#e9b6aa" strokeWidth="2"/><path d="M173 150 C189 140 203 153 199 180 C196 204 181 218 161 213 C153 195 158 166 173 150Z" fill="#b8757c" opacity=".9" stroke="#e9b6aa" strokeWidth="2"/><path d="M150 128 L150 196 M150 170 L131 184 M150 170 L169 184" stroke="#e7c2ae" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M150 231 C132 216 111 229 116 251 C120 271 138 291 150 300 C162 291 180 271 184 251 C189 229 168 216 150 231Z" fill="url(#organ-core)" stroke="#f0c0ad" strokeWidth="2"/>
          <path d="M150 305 C126 295 112 315 120 339 C129 363 144 373 150 376 C156 373 171 363 180 339 C188 315 174 295 150 305Z" fill="#bd8b67" opacity=".9"/>
          <path d="M105 360 C89 355 87 381 98 394 C109 405 122 392 120 377 C118 366 113 362 105 360Z" fill="#a86e72" stroke="#e8b2a4" strokeWidth="2"/><path d="M195 360 C211 355 213 381 202 394 C191 405 178 392 180 377 C182 366 187 362 195 360Z" fill="#a86e72" stroke="#e8b2a4" strokeWidth="2"/><path d="M120 387 C128 372 172 372 180 387 C191 410 176 434 150 438 C124 434 109 410 120 387Z" fill="#d69b78" opacity=".9"/>
          <path d="M125 450 C105 441 107 468 124 480 C137 489 141 476 150 471 C159 476 163 489 176 480 C193 468 195 441 175 450 C164 455 160 462 150 461 C140 462 136 455 125 450Z" fill="#a6c1a5" opacity=".9"/>
        </svg>
        {organAtlas.map(item=><button key={item.id} className={"organ-hotspot "+(selected===item.id?"selected":"")} style={{left:item.position.left,top:item.position.top}} onClick={()=>{setSelected(item.id);setShowDetail(false)}} aria-label={"Explore "+item.name} aria-pressed={selected===item.id}><span>{item.id==="heart"?"♥":item.id==="brain"?"✳":item.id==="lungs"?"Ⅱ":item.id==="liver"?"◒":item.id==="stomach"?"◉":item.id==="kidneys"?"◈":item.id==="pancreas"?"⌁":item.id==="spleen"?"◆":item.id==="bladder"?"◯":"⌘"}</span></button>)}
        <div className="organ-map-caption"><span>HUMAN ANATOMY</span><b>SELECT AN ORGAN</b></div>
      </div>
      <div className="organ-atlas-detail">
        <div className="organ-detail-top"><span>{organ.system}</span><small>{organ.tag}</small></div>
        <div className={"organ-render organ-"+organ.id}>
          <div className="organ-render-orbit"/><div className="organ-render-orbit second"/>
          <svg viewBox="0 0 100 100" role="img" aria-label={organ.name+" anatomical illustration"}>
            <defs><linearGradient id="organ-render-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffc0ae"/><stop offset=".48" stopColor="#d97880"/><stop offset="1" stopColor="#8b4565"/></linearGradient><filter id="organ-render-shadow"><feGaussianBlur stdDeviation="2.8"/></filter></defs>
            <path d={organ.path} transform="translate(0 2)" fill="#1c3d51" opacity=".15" filter="url(#organ-render-shadow)"/>
            <path d={organ.path} fill="url(#organ-render-fill)" stroke="#f5c6b6" strokeWidth="1.2"/>
            {organ.id==="brain"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2" opacity=".8"><path d="M27 30 Q38 18 42 34 T58 29 T74 34 M26 43 Q39 33 44 48 T60 44 T74 47 M39 57 Q49 48 55 60 T67 57"/></g>}
            {organ.id==="heart"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2.5" strokeLinecap="round"><path d="M50 18 L50 2 M50 20 L35 7 M50 20 L66 5 M50 43 L50 80"/></g>}
            {organ.id==="lungs"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2.3" strokeLinecap="round"><path d="M50 8 L50 35 L35 48 M50 35 L65 48 M35 48 L27 66 M35 48 L41 70 M65 48 L59 70 M65 48 L73 66"/></g>}
            {organ.id==="liver"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2" strokeLinecap="round"><path d="M15 43 Q42 24 80 35 M50 30 L47 66 M33 47 L28 61"/></g>}
            {organ.id==="stomach"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2" strokeLinecap="round"><path d="M42 25 Q60 32 47 46 T54 68 M60 37 Q72 48 58 58"/></g>}
            {organ.id==="kidneys"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2.5" strokeLinecap="round"><path d="M27 24 Q44 45 34 69 M73 24 Q56 45 66 69 M34 49 L50 55 L66 49"/></g>}
            {organ.id==="intestines"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2" strokeLinecap="round"><path d="M26 28 Q48 16 72 28 Q83 42 65 45 Q35 42 31 55 Q31 75 66 70 M38 31 Q35 45 51 47 Q69 49 61 61 Q50 70 39 61"/></g>}
            {organ.id==="pancreas"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2.2" strokeLinecap="round"><path d="M18 50 Q35 30 49 43 T82 37 M27 48 L32 57 M47 43 L49 56 M68 39 L73 49"/></g>}
            {organ.id==="spleen"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2.2" strokeLinecap="round"><path d="M48 18 Q26 37 37 64 M58 20 Q76 39 60 70"/></g>}
            {organ.id==="bladder"&&<g fill="none" stroke="#ffe2d2" strokeWidth="2.2" strokeLinecap="round"><path d="M50 3 L50 22 M32 43 Q50 58 68 43 M50 62 L50 90"/></g>}
            {organ.id!=="brain"&&organ.id!=="heart"&&organ.id!=="lungs"&&organ.id!=="liver"&&organ.id!=="stomach"&&organ.id!=="kidneys"&&<path d="M50 18 C38 30 36 47 50 77" fill="none" stroke="#ffe0cf" strokeWidth="2" opacity=".65" strokeLinecap="round"/>}
          </svg>
          <span className="organ-render-label">BIO / {String(organAtlas.findIndex(item=>item.id===selected)+1).padStart(2,"0")}</span>
        </div>
        <span className="px-kicker">ORGAN PROFILE / {organ.name.toUpperCase()}</span>
        <h3>{organ.name}</h3><p className="organ-role">{organ.role}</p>
        <div className="organ-facts">{organ.facts.map(([value,label])=><div key={label}><b>{value}</b><small>{label}</small></div>)}</div>
        <div className="organ-flow"><span>PROCESS MAP / HOW IT WORKS</span><div>{organFlow[selected].map((step,index)=><div className="organ-flow-step" key={step}><b>{step}</b>{index<2&&<ArrowRight size={13}/>}</div>)}</div></div>
        <button className="organ-detail-toggle" onClick={()=>setShowDetail(v=>!v)}>{showDetail?"Hide anatomy notes":"Open anatomy notes"} <ArrowUpRight size={15}/></button>
        {showDetail&&<div className="organ-deep-note"><b>HOW IT WORKS</b><p>{organ.detail}</p></div>}
        <div className="organ-switcher"><span>EXPLORE ANOTHER ORGAN</span><div>{organAtlas.map(item=><button key={item.id} onClick={()=>{setSelected(item.id);setShowDetail(false)}} className={selected===item.id?"active":""}>{item.name}</button>)}</div></div>
      </div>
    </div>
    <div className="organ-atlas-foot"><span>ANATOMY / EDUCATIONAL MODEL</span><span>Illustrative anatomy · not to scale</span></div>
  </section>;
}

export function BioExperience() {
  const [active,setActive] = useState("heart");
  const [expanded,setExpanded] = useState(false);
  const current = chapters.find(c=>c.id===active)!;
  const activeIndex = chapters.findIndex(c=>c.id===active);
  const Icon = current.icon;
  useEffect(()=>{const requested=window.location.hash.slice(1);if(chapters.some(ch=>ch.id===requested))setActive(requested);},[]);
  useEffect(()=>{if(window.location.hash==="#"+active)document.getElementById("explorer")?.scrollIntoView({behavior:"smooth",block:"start"});},[active]);
  return <main className="px-site px-bio-site">
    <Header/>
    <section className="px-bio-hero">
      <div className="px-bio-hero-copy"><Link href="/" className="px-back-link">← BACK TO SHISHU MEDICAL HALL</Link><span className="px-kicker">BIO INTELLIGENT / A VISUAL LEARNING PROJECT</span><h1>Life is extraordinary.<br/><em>Look a little closer.</em></h1><p>Step inside the science of being human. Explore the systems that keep us alive, the cells that build us and the discoveries behind modern medicine.</p><div className="px-bio-hero-meta"><span><ShieldCheck size={14}/> Evidence-aware learning</span><span><BookOpen size={14}/> Four guided chapters</span></div></div>
      <div className="px-bio-hero-art"><HeartArtwork large/><span className="px-hero-art-index">PLATE 001 · HUMAN BIOLOGY</span></div>
    </section>
    <section className="px-bio-intro-strip"><span>THE HUMAN BODY / AN OPEN BOOK</span><p>Every heartbeat, every cell, every medicine has a story. <b>Start exploring yours.</b></p><span>SCROLL TO EXPLORE ↓</span></section>
    <nav className="px-bio-sticky-nav" aria-label="Bio Intelligent section navigation">
      <a href="#organs">Organs</a><a href="#explorer">Chapters</a><a href="#connections">The bigger picture</a><a href="#disclaimer">Learning note</a>
      <div className="px-bio-progress"><span style={{width:((activeIndex+1)/chapters.length*100)+"%"}}/></div>
      <small>CHAPTER {activeIndex+1} OF 4</small>
    </nav>
    <OrganAtlas/>
    <section className="px-bio-explorer" id="explorer">
      <div className="px-explorer-heading"><div><span className="px-kicker">INTERACTIVE FIELD GUIDE / 01—04</span><h2>Choose a system.<br/><em>Follow the science.</em></h2></div><p>Move between chapters to explore four connected parts of biology and medicine. Each chapter reveals a different layer of the story.</p></div>
      <div className="px-explorer-layout">
        <aside className="px-chapter-rail"><span className="px-rail-label">CHAPTER INDEX</span>{chapters.map(c=><button key={c.id} onClick={()=>{setActive(c.id);setExpanded(false)}} className={active===c.id?"active":""}><span>{c.no}</span><b>{c.label}</b><ArrowUpRight size={15}/></button>)}<div className="px-rail-note"><Atom size={17}/><span>Four perspectives.<br/>One connected system.</span></div></aside>
        <div className="px-chapter-stage">
          <AnimatePresence mode="wait"><motion.article id={current.id} key={current.id} className={"px-active-chapter "+current.accent} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.35,ease}}>
            <div className="px-stage-visual"><div className="px-stage-grid"/><div className="px-stage-orbit" aria-hidden="true"/><div className="px-stage-icon"><Icon size={90} strokeWidth={1}/></div><span className="px-stage-figure">FIG. {current.no}</span><span className="px-stage-visual-label">{current.sub}</span></div>
            <div className="px-stage-copy"><span className="px-kicker">{current.no} / {current.sub}</span><h3>{current.title}</h3><p>{current.intro}</p><div className="px-stage-stat"><b>{current.stat}</b><small>{current.unit}</small></div><div className="px-fact-list">{current.facts.map((fact,i)=><div key={fact}><span>0{i+1}</span>{fact}</div>)}</div><button className="px-deep-dive" onClick={()=>setExpanded(!expanded)}>{expanded?"Close chapter notes":"Explore key ideas"} <ChevronDown size={16}/></button>{expanded&&<motion.div className="px-expanded-note" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}><p>{current.id==="heart"?"The cardiac cycle alternates between relaxation (diastole) and contraction (systole). Blood enters the atria, passes into the ventricles and is then pumped to the lungs or the rest of the body.":current.id==="cells"?"Cells specialise for different jobs. Their structures, internal compartments and communication systems allow tissues and organs to work together.":current.id==="medicine"?"A medicine's effect depends on its pharmacology, formulation, dose, route and the patient's characteristics. A healthcare professional helps determine appropriate use.":"Drug development combines laboratory science, clinical evidence, quality controls and regulatory oversight. Each stage asks whether a candidate is safe and useful enough to progress."}</p></motion.div>}</div>
          </motion.article></AnimatePresence>
          <div className="px-stage-controls"><span>CHAPTER {current.no} OF 04</span><div><button disabled={active==="heart"} onClick={()=>{setActive(chapters[chapters.findIndex(c=>c.id===active)-1].id);setExpanded(false)}}>← Previous</button><button disabled={active==="research"} onClick={()=>{setActive(chapters[chapters.findIndex(c=>c.id===active)+1].id);setExpanded(false)}}>Next chapter <ArrowRight size={14}/></button></div></div>
        </div>
      </div>
    </section>
    <section className="px-bio-connection" id="connections"><div><span className="px-kicker">THE BIGGER PICTURE</span><h2>Biology explains life.<br/><em>Pharmacology connects care.</em></h2></div><p>Understanding the human body gives us a better foundation for understanding medicines — how they work, why they are developed and why safe use matters.</p><Link href="/pharma">Explore pharmaceutical science <ArrowUpRight size={15}/></Link></section>
    <section className="px-bio-disclaimer" id="disclaimer"><ShieldCheck size={20}/><div><b>Learning, not diagnosis.</b><p>This experience is for general education. It does not diagnose, prescribe or replace advice from a registered doctor or pharmacist. Always follow qualified professional guidance for personal health decisions.</p></div></section>
    <Footer/>
    <PulseDock/>
  </main>;
}
