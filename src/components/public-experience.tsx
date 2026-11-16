"use client";

import Link from "next/link";
import { useState } from "react";
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

function Header({ shop = "Shishu Medical Hall" }: { shop?: string }) {
  const [open, setOpen] = useState(false);
  return <header className="px-header">
    <Link href="/" className="px-brand"><img src="/logo.jpg" alt="" /><span><b>{shop}</b><small>অর্জুন ডাক্তারের দোকান</small></span></Link>
    <nav className="px-nav"><Link href="/medicines">Medicines</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></nav>
    <div className="px-head-actions"><Link href="/dashboard" className="px-portal">Store portal <ArrowUpRight size={14}/></Link><button className="px-menu-button" aria-label="Open navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
    <AnimatePresence>{open && <motion.nav className="px-mobile-nav" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><Link onClick={()=>setOpen(false)} href="/medicines">Medicines</Link><Link onClick={()=>setOpen(false)} href="/pharma">Pharma & science</Link><Link onClick={()=>setOpen(false)} href="/bio-intelligent">Bio Intelligent</Link><Link onClick={()=>setOpen(false)} href="/health-library">Health library</Link><Link onClick={()=>setOpen(false)} href="/dashboard">Store portal</Link></motion.nav>}</AnimatePresence>
  </header>;
}

function HeartArtwork({ large = false }: { large?: boolean }) {
  return <div className={large ? "px-heart-art px-heart-large" : "px-heart-art"}>
    <div className="px-heart-grid"/>
    <motion.div className="px-heart-orbit px-orbit-a" animate={{rotate:360}} transition={{duration:32,repeat:Infinity,ease:"linear"}}/>
    <motion.div className="px-heart-orbit px-orbit-b" animate={{rotate:-360}} transition={{duration:24,repeat:Infinity,ease:"linear"}}/>
    <motion.div className="px-heart-glass" animate={{y:[0,-9,0],rotate:[-3,0,-3]}} transition={{duration:5.5,repeat:Infinity,ease:"easeInOut"}}>
      <svg viewBox="0 0 260 260" role="img" aria-label="Abstract translucent anatomical heart illustration">
        <defs>
          <linearGradient id="pxHeartFill" x1="25" y1="10" x2="230" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" stopOpacity=".96"/><stop offset=".36" stopColor="#8bdcf0" stopOpacity=".78"/><stop offset=".7" stopColor="#899ce5" stopOpacity=".78"/><stop offset="1" stopColor="#5de0ce" stopOpacity=".88"/></linearGradient>
          <linearGradient id="pxHeartStroke" x1="35" y1="0" x2="220" y2="245" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset="1" stopColor="#8af5e7"/></linearGradient>
          <filter id="pxGlow"><feGaussianBlur stdDeviation="7"/></filter>
        </defs>
        <path d="M130 229C112 211 31 153 25 96 20 51 47 20 87 22c20 1 34 13 43 31 11-20 27-31 48-31 39 0 66 31 60 74-7 56-90 106-108 133Z" fill="#71d9e4" opacity=".25" filter="url(#pxGlow)"/>
        <path d="M130 229C112 211 31 153 25 96 20 51 47 20 87 22c20 1 34 13 43 31 11-20 27-31 48-31 39 0 66 31 60 74-7 56-90 106-108 133Z" fill="url(#pxHeartFill)" stroke="url(#pxHeartStroke)" strokeWidth="3"/>
        <path d="M72 71c-4 34 21 46 40 58 18 11 21 28 18 59M185 72c-20 13-35 32-36 54-1 22 14 39 26 56M130 53c-5 32-4 53 4 71 8 20 7 43-4 75" fill="none" stroke="#fff" strokeOpacity=".72" strokeWidth="4" strokeLinecap="round"/>
        <path d="M39 108h45l13-21 21 54 21-78 18 45h52" fill="none" stroke="#f7ffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M84 27c18-2 31 6 40 19" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".9"/>
      </svg>
    </motion.div>
    <span className="px-heart-label px-label-one"><i/> CARDIOVASCULAR SYSTEM</span>
    <span className="px-heart-label px-label-two"><Activity size={13}/> LIFE IN MOTION</span>
    <span className="px-heart-index">FIG. 01 / HUMAN BIOLOGY</span>
  </div>;
}

function Footer({ profile }: { profile?: Profile }) {
  return <footer className="px-footer"><div className="px-footer-top"><div><Link href="/" className="px-brand"><img src="/logo.jpg" alt=""/><span><b>{profile?.shop_name || "Shishu Medical Hall"}</b><small>{profile?.local_name || "অর্জুন ডাক্তারের দোকান"}</small></span></Link><p>A neighbourhood pharmacy with a space for better understanding of medicines, health and science.</p></div><div className="px-footer-links"><b>Explore</b><Link href="/medicines">Medicine directory</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></div><div className="px-footer-links"><b>Contact</b><span><MapPin size={14}/>{profile?.address || "Visit our pharmacy"}</span><span><Phone size={14}/>{profile?.phone || "Contact details coming soon"}</span><span><Clock3 size={14}/>Local pharmacy</span></div></div><div className="px-footer-bottom"><span>© {new Date().getFullYear()} {profile?.shop_name || "Shishu Medical Hall"}</span><span>Medicine information is educational and does not replace professional advice.</span></div></footer>;
}

export function HomeExperience({ profile = {} }: { profile?: Profile }) {
  const shop = profile.shop_name || "Shishu Medical Hall";
  const cards = [
    {n:"01",icon:Pill,kicker:"MEDICINE REFERENCE",title:"Know what goes into your medicine.",body:"Explore brand names, generic ingredients, strengths and useful medicine references.",href:"/medicines",tone:"blue"},
    {n:"02",icon:FlaskConical,kicker:"PHARMACEUTICAL SCIENCE",title:"Behind every tablet is a story.",body:"Discover how medicines are researched, developed, manufactured and quality-checked.",href:"/pharma",tone:"mint"},
    {n:"03",icon:BookOpen,kicker:"HEALTH KNOWLEDGE",title:"Understand health, one idea at a time.",body:"Practical explainers on medicine labels, safe storage and everyday health literacy.",href:"/health-library",tone:"lilac"}
  ];
  return <main className="px-site">
    <Header shop={shop}/>
    <section className="px-home-hero">
      <div className="px-hero-copy">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={reveal} className="px-eyebrow"><i/> YOUR LOCAL PHARMACY · A WORLD OF KNOWLEDGE</motion.div>
          <motion.h1 variants={reveal}>Care you know.<br/><em>Knowledge that grows.</em></motion.h1>
          <motion.p variants={reveal}>Welcome to <b>{shop}</b> — your familiar neighbourhood pharmacy, with a thoughtful place to explore medicines, the human body and the science behind healthcare.</motion.p>
          <motion.div variants={reveal} className="px-hero-buttons"><Link className="px-button-primary" href="/medicines">Explore medicines <ArrowUpRight size={16}/></Link><Link className="px-button-text" href="/bio-intelligent">Discover Bio Intelligent <ArrowRight size={15}/></Link></motion.div>
          <motion.div variants={reveal} className="px-hero-proof"><span><ShieldCheck size={15}/> Community pharmacy</span><i/><span><Sparkles size={15}/> Learn with curiosity</span></motion.div>
        </motion.div>
      </div>
      <motion.div className="px-hero-visual" initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{duration:1,ease}}>
        <div className="px-visual-caption"><span>SHISHU / BIO INTELLIGENT</span><span>01 — 04</span></div><HeartArtwork large/><div className="px-visual-foot"><span>THE HUMAN SYSTEM</span><span>SCIENCE · CARE · DISCOVERY</span></div>
      </motion.div>
      <div className="px-hero-side-note">A LITTLE CLOSER TO THE SCIENCE OF YOU <ArrowDownRight size={15}/></div>
    </section>
    <section className="px-intro-band"><span>01 / A PLACE TO BEGIN</span><p>From the medicines we use to the biology that makes us human — <b>understanding matters.</b></p><span>EST. IN YOUR COMMUNITY</span></section>
    <section className="px-discover-section">
      <motion.div className="px-section-heading" initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} variants={stagger}><motion.div variants={reveal}><span className="px-kicker">EXPLORE THE KNOWLEDGE SPACE</span><h2>More than a pharmacy.<br/><em>A place to discover.</em></h2></motion.div><motion.p variants={reveal}>A carefully organised starting point for medicine references, pharmaceutical science and clear, useful health knowledge.</motion.p></motion.div>
      <div className="px-discover-grid">{cards.map((c,i)=><motion.div key={c.n} className={"px-discover-card "+c.tone} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.65,delay:i*.1,ease}}><div className="px-discover-top"><span>{c.n} / EXPLORE</span><c.icon size={21}/></div><small>{c.kicker}</small><h3>{c.title}</h3><p>{c.body}</p><Link href={c.href}>Explore section <ArrowUpRight size={15}/></Link></motion.div>)}</div>
    </section>
    <section className="px-bio-feature">
      <motion.div className="px-bio-art-wrap" initial={{opacity:0,x:-25}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.25}} transition={{duration:.8,ease}}><HeartArtwork/><div className="px-art-side-caption">BIO / 001<br/>THE HUMAN BODY</div></motion.div>
      <motion.div className="px-bio-feature-copy" initial={{opacity:0,x:25}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.25}} transition={{duration:.8,ease}}><span className="px-kicker">THE FEATURED EXPERIENCE</span><h2>Meet your body.<br/><em>Understand its wonder.</em></h2><p>Bio Intelligent is a visual learning space where biology meets medicine. Explore the heart, cells, DNA, the way medicines work and the research that moves healthcare forward.</p><div className="px-feature-tags"><span><HeartPulse size={14}/> Human systems</span><span><Dna size={14}/> Cells & DNA</span><span><Microscope size={14}/> Research</span></div><Link href="/bio-intelligent" className="px-button-primary">Enter Bio Intelligent <ArrowUpRight size={16}/></Link></motion.div>
    </section>
    <section className="px-principles"><div className="px-principles-title"><span className="px-kicker">OUR APPROACH</span><h2>Familiar care.<br/><em>Thoughtful knowledge.</em></h2></div><div className="px-principle"><span>01</span><div><b>Rooted in the community</b><p>A familiar local pharmacy, built around everyday needs and trust.</p></div></div><div className="px-principle"><span>02</span><div><b>Information with context</b><p>Clear learning resources that help make complex topics easier to understand.</p></div></div><div className="px-principle"><span>03</span><div><b>Curiosity without confusion</b><p>Explore science in a structured way, without replacing professional advice.</p></div></div></section>
    <section className="px-contact-cta"><div><span className="px-kicker">SHISHU MEDICAL HALL</span><h2>Your neighbourhood pharmacy.<br/><em>Always a little more to learn.</em></h2></div><div><p>{profile.tagline_en || "A familiar address for everyday healthcare."}</p><Link href="/dashboard">Store management <ArrowUpRight size={15}/></Link></div></section>
    <Footer profile={profile}/>
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
  const Icon = current.icon;
  return <main className="px-site px-bio-site">
    <Header/>
    <section className="px-bio-hero">
      <div className="px-bio-hero-copy"><Link href="/" className="px-back-link">← BACK TO SHISHU MEDICAL HALL</Link><span className="px-kicker">BIO INTELLIGENT / A VISUAL LEARNING PROJECT</span><h1>Life is extraordinary.<br/><em>Look a little closer.</em></h1><p>Step inside the science of being human. Explore the systems that keep us alive, the cells that build us and the discoveries behind modern medicine.</p><div className="px-bio-hero-meta"><span><ShieldCheck size={14}/> Evidence-aware learning</span><span><BookOpen size={14}/> Four guided chapters</span></div></div>
      <div className="px-bio-hero-art"><HeartArtwork large/><span className="px-hero-art-index">PLATE 001 · HUMAN BIOLOGY</span></div>
    </section>
    <section className="px-bio-intro-strip"><span>THE HUMAN BODY / AN OPEN BOOK</span><p>Every heartbeat, every cell, every medicine has a story. <b>Start exploring yours.</b></p><span>SCROLL TO EXPLORE ↓</span></section>
    <section className="px-bio-explorer" id="explorer">
      <div className="px-explorer-heading"><div><span className="px-kicker">INTERACTIVE FIELD GUIDE / 01—04</span><h2>Choose a system.<br/><em>Follow the science.</em></h2></div><p>Move between chapters to explore four connected parts of biology and medicine. Each chapter reveals a different layer of the story.</p></div>
      <div className="px-explorer-layout">
        <aside className="px-chapter-rail"><span className="px-rail-label">CHAPTER INDEX</span>{chapters.map(c=><button key={c.id} onClick={()=>{setActive(c.id);setExpanded(false)}} className={active===c.id?"active":""}><span>{c.no}</span><b>{c.label}</b><ArrowUpRight size={15}/></button>)}<div className="px-rail-note"><Atom size={17}/><span>Four perspectives.<br/>One connected system.</span></div></aside>
        <div className="px-chapter-stage">
          <AnimatePresence mode="wait"><motion.article key={current.id} className={"px-active-chapter "+current.accent} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.35,ease}}>
            <div className="px-stage-visual"><div className="px-stage-grid"/><motion.div className="px-stage-orbit" animate={{rotate:360}} transition={{duration:28,repeat:Infinity,ease:"linear"}}/><div className="px-stage-icon"><Icon size={90} strokeWidth={1}/></div><span className="px-stage-figure">FIG. {current.no}</span><span className="px-stage-visual-label">{current.sub}</span></div>
            <div className="px-stage-copy"><span className="px-kicker">{current.no} / {current.sub}</span><h3>{current.title}</h3><p>{current.intro}</p><div className="px-stage-stat"><b>{current.stat}</b><small>{current.unit}</small></div><div className="px-fact-list">{current.facts.map((fact,i)=><div key={fact}><span>0{i+1}</span>{fact}</div>)}</div><button className="px-deep-dive" onClick={()=>setExpanded(!expanded)}>{expanded?"Close chapter notes":"Explore key ideas"} <ChevronDown size={16}/></button>{expanded&&<motion.div className="px-expanded-note" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}><p>{current.id==="heart"?"The cardiac cycle alternates between relaxation (diastole) and contraction (systole). Blood enters the atria, passes into the ventricles and is then pumped to the lungs or the rest of the body.":current.id==="cells"?"Cells specialise for different jobs. Their structures, internal compartments and communication systems allow tissues and organs to work together.":current.id==="medicine"?"A medicine's effect depends on its pharmacology, formulation, dose, route and the patient's characteristics. A healthcare professional helps determine appropriate use.":"Drug development combines laboratory science, clinical evidence, quality controls and regulatory oversight. Each stage asks whether a candidate is safe and useful enough to progress."}</p></motion.div>}</div>
          </motion.article></AnimatePresence>
          <div className="px-stage-controls"><span>CHAPTER {current.no} OF 04</span><div><button disabled={active==="heart"} onClick={()=>{setActive(chapters[chapters.findIndex(c=>c.id===active)-1].id);setExpanded(false)}}>← Previous</button><button disabled={active==="research"} onClick={()=>{setActive(chapters[chapters.findIndex(c=>c.id===active)+1].id);setExpanded(false)}}>Next chapter <ArrowRight size={14}/></button></div></div>
        </div>
      </div>
    </section>
    <section className="px-bio-connection"><div><span className="px-kicker">THE BIGGER PICTURE</span><h2>Biology explains life.<br/><em>Pharmacology connects care.</em></h2></div><p>Understanding the human body gives us a better foundation for understanding medicines — how they work, why they are developed and why safe use matters.</p><Link href="/pharma">Explore pharmaceutical science <ArrowUpRight size={15}/></Link></section>
    <section className="px-bio-disclaimer"><ShieldCheck size={20}/><div><b>Learning, not diagnosis.</b><p>This experience is for general education. It does not diagnose, prescribe or replace advice from a registered doctor or pharmacist. Always follow qualified professional guidance for personal health decisions.</p></div></section>
    <Footer/>
  </main>;
}
