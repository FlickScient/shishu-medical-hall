"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  return <div className={large ? "px-heart-art px-heart-large" : "px-heart-art"} aria-label="Animated red heart illustration">
    <div className="px-heart-orbit px-orbit-a" aria-hidden="true"/>
    <div className="px-heart-orbit px-orbit-b" aria-hidden="true"/>
    <svg className="px-heart-svg" viewBox="0 0 200 190" role="img" aria-label="A red heart with a heartbeat line">
      <path className="px-heart-shape" d="M100 169 C87 157 23 111 18 69 C13 29 60 9 91 39 L100 49 L109 39 C140 9 187 29 182 69 C177 111 113 157 100 169Z" fill="#e83e52"/>
      <path d="M37 62 C39 43 55 34 70 39" fill="none" stroke="#fff" strokeOpacity=".42" strokeWidth="5" strokeLinecap="round"/>
      <path className="px-heart-ecg" d="M27 94 H66 L79 75 L94 116 L111 59 L127 95 H172" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="px-heart-label px-label-one"><i/> CARDIOVASCULAR SYSTEM</span>
    <span className="px-heart-label px-label-two"><Activity size={13}/> LIFE IN MOTION</span>
    <span className="px-heart-index">FIG. 01 / HUMAN BIOLOGY</span>
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
  useEffect(()=>{setTipIndex(Math.floor(Math.random()*healthGuides.length));},[]);
  const shop = profile.shop_name || "Shishu Medical Hall";
  const healthGuideCount = healthGuides.length;
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
          <motion.div variants={reveal} className="px-eyebrow"><i/> {language==="bn"?"আপনার পরিচিত ফার্মেসি · জ্ঞানের নতুন দিগন্ত":"YOUR LOCAL PHARMACY · A WORLD OF KNOWLEDGE"}</motion.div>
          <motion.h1 variants={reveal}>{language==="bn"?<>যত্নের পরিচয়।<br/><em>জ্ঞানে এগিয়ে চলি।</em></>:<>Care you know.<br/><em>Knowledge that grows.</em></>}</motion.h1>
          <motion.p variants={reveal}>{language==="bn"?<><b>{shop}</b>-এ স্বাগতম — ওষুধ, মানবদেহ এবং স্বাস্থ্যবিজ্ঞানের বিষয়গুলো সহজভাবে জানার একটি পরিচিত ঠিকানা।</>:<>Welcome to <b>{shop}</b> — your familiar neighbourhood pharmacy, with a thoughtful place to explore medicines, the human body and the science behind healthcare.</>}</motion.p>
          <motion.div variants={reveal} className="px-hero-buttons"><Link className="px-button-primary" href="/medicines">{language==="bn"?"ওষুধ সম্পর্কে জানুন":"Explore medicines"} <ArrowUpRight size={16}/></Link><Link className="px-button-text" href="/bio-intelligent">{language==="bn"?"বায়ো ইন্টেলিজেন্ট দেখুন":"Discover Bio Intelligent"} <ArrowRight size={15}/></Link></motion.div>
          <motion.div variants={reveal} className="px-hero-proof"><span><ShieldCheck size={15}/> Community pharmacy</span><i/><span><Sparkles size={15}/> Learn with curiosity</span></motion.div>
        </motion.div>
      </div>
      <motion.div className="px-hero-visual" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{duration:1,ease}}>
        <div className="px-visual-caption"><span>SHISHU / BIO INTELLIGENT</span><span>01 — 04</span></div><HeartArtwork large/><div className="px-visual-foot"><span>THE HUMAN SYSTEM</span><span>SCIENCE · CARE · DISCOVERY</span></div>
      </motion.div>
      <div className="px-hero-side-note">A LITTLE CLOSER TO THE SCIENCE OF YOU <ArrowDownRight size={15}/></div>
    </section>
    <section className="px-intro-band"><span>01 / A PLACE TO BEGIN</span><p>From the medicines we use to the biology that makes us human — <b>understanding matters.</b></p><span>EST. IN YOUR COMMUNITY</span></section>
    <section className="px-live-strip" aria-label="Live content and medicine counts">
      <div className="px-live-strip-heading"><span className="px-kicker">THE KNOWLEDGE INDEX</span><p>Real counts from the published guides, Bio Intelligent chapters and local medicine database.</p></div>
      <div className="px-live-stat"><b>{medicineCount === null ? "—" : medicineCount.toLocaleString("en-BD")}</b><small>Locally indexed medicines</small><em>{medicineCount === null ? "Count unavailable" : medicineCount === 0 ? "No local records yet" : "Local catalogue records"}</em></div>
      <div className="px-live-stat"><b>{healthGuideCount.toString().padStart(2,"0")}</b><small>Health Library guides</small><em>Published guides</em></div>
      <div className="px-live-stat"><b>{bioChapterCount.toString().padStart(2,"0")}</b><small>Bio Intelligent chapters</small><em>Guided chapters</em></div>
      <p className="px-live-strip-note">MedEx Bangladesh is linked as an external reference directory; its catalogue is not counted as locally hosted medicine data.</p>
    </section>
    <section className="px-today-tip">
      <div className="px-tip-icon"><BookOpen size={22}/></div>
      <div className="px-tip-copy"><span className="px-kicker">TODAY'S HEALTH TIP / HEALTH LIBRARY</span><h2>{healthGuides[tipIndex].title}</h2><p>{healthGuides[tipIndex].intro}</p><small>{healthGuides[tipIndex].items[0]}</small><Link href={"/health-library#"+healthGuides[tipIndex].id}>Read the guide <ArrowUpRight size={14}/></Link></div>
      <button className="px-tip-next" onClick={()=>setTipIndex((tipIndex+1)%healthGuides.length)} aria-label="Show another health tip">Another tip <ArrowRight size={15}/></button>
    </section>
    <section className="px-pathways">
      <div className="px-pathways-heading"><span className="px-kicker">EXPLORE BY INTEREST</span><h2>Health is connected.<br/><em>So is everything we learn.</em></h2><p>Start with a subject, then follow the science behind it.</p></div>
      <div className="px-pathway-grid">
        <Link href="/bio-intelligent#explorer" className="px-pathway-card pathway-heart"><span className="px-pathway-icon"><HeartPulse/></span><small>HUMAN BIOLOGY / 01</small><b>Heart & circulation</b><span>Understand the rhythm behind life <ArrowUpRight size={15}/></span></Link>
        <Link href="/bio-intelligent#explorer" className="px-pathway-card pathway-dna"><span className="px-pathway-icon"><Dna/></span><small>CELLULAR SCIENCE / 02</small><b>Cells & DNA</b><span>Explore life's smallest instructions <ArrowUpRight size={15}/></span></Link>
        <Link href="/bio-intelligent#explorer" className="px-pathway-card pathway-medicine"><span className="px-pathway-icon"><FlaskConical/></span><small>PHARMACOLOGY / 03</small><b>How medicines work</b><span>Connect molecules with medicine <ArrowUpRight size={15}/></span></Link>
        <Link href="/health-library" className="px-pathway-card pathway-safety"><span className="px-pathway-icon"><ShieldCheck/></span><small>HEALTH LITERACY / 04</small><b>Everyday medicine safety</b><span>Learn labels, storage and safe use <ArrowUpRight size={15}/></span></Link>
      </div>
    </section>
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
      <a href="#explorer">Chapters</a><a href="#connections">The bigger picture</a><a href="#disclaimer">Learning note</a>
      <div className="px-bio-progress"><span style={{width:((activeIndex+1)/chapters.length*100)+"%"}}/></div>
      <small>CHAPTER {activeIndex+1} OF 4</small>
    </nav>
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
