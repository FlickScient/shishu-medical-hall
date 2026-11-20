"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Menu, X, MapPin, Phone, Activity, Dna, FlaskConical, Pill, Microscope, ChevronDown } from "lucide-react";
import { healthGuides } from "@/lib/health-guides";
import styles from "./home-experience-v3.module.css";

type Profile = { shop_name?: string; local_name?: string; phone?: string; address?: string; proprietor_name?: string };
const image = {
  heart: "https://commons.wikimedia.org/wiki/Special:FilePath/Human_heart.jpg?width=1800",
  dna: "https://commons.wikimedia.org/wiki/Special:FilePath/3D_DNA.png?width=1400",
  lab: "https://commons.wikimedia.org/wiki/Special:FilePath/A_pharmaceutical_laboratory_with_books_and_equipment_on_a_lo_Wellcome_V0029788.jpg?width=1600",
  pills: "https://commons.wikimedia.org/wiki/Special:FilePath/Pills.JPG?width=1400",
  microscope: "https://commons.wikimedia.org/wiki/Special:FilePath/Laboratory_Microscope.jpg?width=1400",
  cells: "https://commons.wikimedia.org/wiki/Special:FilePath/HeLa_cells_stained_with_Hoechst_33258.jpg?width=1400"
};

function Header({shop, language, toggle}: {shop:string;language:"en"|"bn";toggle:()=>void}) {
  const [open,setOpen]=useState(false);
  return <header className={styles.header}>
    <Link href="/" className={styles.brand}><img src="/logo.jpg" alt=""/><span><b>{shop}</b><small>অর্জুন ডাক্তারের দোকান</small></span></Link>
    <nav className={styles.nav}><Link href="/medicines">Medicines</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></nav>
    <div className={styles.actions}><button className={styles.lang} onClick={toggle}>{language==="en"?"বাংলা":"EN"}</button><Link className={styles.portal} href="/dashboard">Store portal <ArrowUpRight size={15}/></Link><button className={styles.menu} onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button></div>
    {open&&<nav className={styles.mobileNav}><Link onClick={()=>setOpen(false)} href="/medicines">Medicines</Link><Link onClick={()=>setOpen(false)} href="/pharma">Pharma & science</Link><Link onClick={()=>setOpen(false)} href="/bio-intelligent">Bio Intelligent</Link><Link onClick={()=>setOpen(false)} href="/health-library">Health library</Link><Link onClick={()=>setOpen(false)} href="/dashboard">Store portal</Link></nav>}
  </header>;
}

export function HomeExperienceV3({profile={},medicineCount=null}:{profile?:Profile;medicineCount?:number|null}) {
  const [language,setLanguage]=useState<"en"|"bn">("en");
  const [tipIndex,setTipIndex]=useState(0);
  const [faq,setFaq]=useState<number|null>(0);
  const [scanActive,setScanActive]=useState(false);
  const shop=profile.shop_name||"Shishu Medical Hall";
  const guides=useMemo(()=>healthGuides.filter((g:any)=>g?.title),[]);
  const tip=guides.length?guides[tipIndex%guides.length]:null;
  const faqs=[
    ["Is this an online pharmacy?","No. This is the public information website of a local pharmacy. It does not sell or deliver medicines online."],
    ["Where does medicine information come from?","The medicine directory links to MedEx Bangladesh as an external reference. Always confirm medicine use with a registered doctor or pharmacist."],
    ["Is the health content medical advice?","No. The guides are educational and cannot diagnose, prescribe or replace professional medical care."]
  ];
  return <main className={styles.site}>
    <Header shop={shop} language={language} toggle={()=>setLanguage(v=>v==="en"?"bn":"en")}/>
    <section className={styles.hero}>
      <div className={styles.heroImage+" "+(scanActive?styles.scanActive:"")}><img src={image.heart} alt="Anatomical study of the human heart"/><div className={styles.heroShade}/><div className={styles.specimenOverlay} aria-hidden="true"><div className={styles.specimenOrbit}/><div className={styles.specimenOrbitInner}/><div className={styles.specimenScan}/><span className={styles.specimenTag+" "+styles.tagA}>AORTA <b>01</b></span><span className={styles.specimenTag+" "+styles.tagB}>ATRIA <b>02</b></span><span className={styles.specimenTag+" "+styles.tagC}>VENTRICLES <b>03</b></span></div><button className={styles.scanToggle} onClick={()=>setScanActive(v=>!v)} aria-pressed={scanActive}>{scanActive?"Close anatomy scan":"Activate anatomy scan"} <Activity size={14}/></button><div className={styles.plate}><span>ANATOMY ARCHIVE</span><b>PLATE 01</b></div><div className={styles.heroCaption}><span>01 — HUMAN CARDIOVASCULAR SYSTEM</span><b>{scanActive?"Anatomy scan active.":"The heart, in focus."}</b></div></div>
      <div className={styles.heroCopy}><span className={styles.kicker}>SHISHU MEDICAL HALL <i/></span><h1>{language==="bn"?<>পরিচিত ফার্মেসি।<br/><em>স্বাস্থ্যকে জানুন।</em></>:<>Health is<br/><em>worth knowing.</em></>}</h1><p>A neighbourhood pharmacy and a place to explore medicines, the human body and the science behind modern healthcare.</p><div className={styles.heroLinks}><Link href="/medicines">Explore medicines <ArrowUpRight size={16}/></Link><Link href="/bio-intelligent">Enter Bio Intelligent <ArrowRight size={16}/></Link></div><div className={styles.heroFoot}><span>LOCAL PHARMACY</span><span>MEDICINE REFERENCES</span><span>HEALTH EDUCATION</span></div></div>
      <a className={styles.scroll} href="#explore"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={17}/></a>
    </section>
    <section className={styles.index} id="explore"><div><span className={styles.kicker}>A CLEARER VIEW</span><h2>Knowledge, with<br/><em>room to explore.</em></h2></div><div className={styles.indexStats}><div><b>{medicineCount===null?"—":medicineCount.toLocaleString("en-BD")}</b><span>Medicine records</span></div><div><b>{String(guides.length).padStart(2,"0")}</b><span>Health guides</span></div><div><b>04</b><span>Bio chapters</span></div></div></section>
    <section className={styles.feature} id="bio-intelligent"><div className={styles.featureImage}><img src={image.dna} alt="Three-dimensional DNA double helix"/><span>FIG. 02 / MOLECULAR BIOLOGY</span></div><div className={styles.featureText}><span className={styles.kicker}>01 / BIO INTELLIGENT</span><h2>Look closer<br/>at what makes<br/><em>us human.</em></h2><p>Move from the beating heart to cells, DNA and the science of medicines. Four guided chapters make complex biology easier to explore.</p><Link href="/bio-intelligent">Explore Bio Intelligent <ArrowUpRight size={17}/></Link><small>ANATOMY · CELL BIOLOGY · PHARMACOLOGY · DISCOVERY</small></div></section>
    <section className={styles.splitFeature}><div className={styles.splitText}><span className={styles.kicker}>02 / PHARMACEUTICAL SCIENCE</span><h2>From the lab<br/>to the medicine<br/><em>in your hand.</em></h2><p>Explore how medicines are researched, formulated, produced and quality-checked — and why every step matters.</p><Link href="/pharma">Explore pharmaceutical science <ArrowUpRight size={17}/></Link></div><div className={styles.splitImage}><img src={image.lab} alt="Pharmaceutical laboratory and research equipment"/><span>RESEARCH / FORMULATION / QUALITY</span></div></section>
    <section className={styles.medicineBand}><div className={styles.medicineImage}><img src={image.pills} alt="Medicine tablets and capsules"/></div><div className={styles.medicineText}><span className={styles.kicker}>03 / MEDICINE REFERENCE</span><h2>Know what’s<br/><em>in the medicine.</em></h2><p>Search brand names, generic ingredients and strengths through a reference directory connected to MedEx Bangladesh.</p><Link href="/medicines">Open medicine directory <ArrowUpRight size={17}/></Link></div></section>
    <section className={styles.tip}><div className={styles.tipVisual}><img src={image.cells} alt="Microscopic view of human cells"/><span>HEALTH LIBRARY / FIELD NOTES</span></div><div className={styles.tipCopy}><span className={styles.kicker}>04 / TODAY’S HEALTH READING</span>{tip?<><h2>{tip.title}</h2><p>{tip.intro}</p><Link href={"/health-library#"+tip.id}>Read the guide <ArrowUpRight size={16}/></Link></>:<><h2>Small steps.<br/><em>Clearer health.</em></h2><p>Explore practical health education in the library.</p><Link href="/health-library">Visit the Health Library <ArrowUpRight size={16}/></Link></>}<button onClick={()=>setTipIndex(i=>(i+1)%Math.max(guides.length,1))} disabled={guides.length<2}>Another reading <ArrowRight size={15}/></button></div></section>
    <section className={styles.faq}><div className={styles.faqIntro}><span className={styles.kicker}>BEFORE YOU EXPLORE</span><h2>Good to know.<br/><em>Clearly stated.</em></h2><p>This website is built for information and learning — not online medicine sales or personal diagnosis.</p></div><div className={styles.faqList}>{faqs.map(([q,a],i)=><article key={q}><button onClick={()=>setFaq(v=>v===i?null:i)}><span>0{i+1}</span><b>{q}</b><ChevronDown className={faq===i?styles.rotated:""}/></button>{faq===i&&<p>{a}</p>}</article>)}</div></section>
    <footer className={styles.footer}><div className={styles.footerMain}><div className={styles.footerBrand}><img src="/logo.jpg" alt=""/><b>{shop}</b><p>A local pharmacy. A clearer view of health.</p></div><div><span>EXPLORE</span><Link href="/medicines">Medicines</Link><Link href="/pharma">Pharma & science</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health library</Link></div><div><span>VISIT THE PHARMACY</span><p><MapPin size={14}/>{profile.address||"Visit our pharmacy"}</p><p><Phone size={14}/>{profile.phone||"Contact the pharmacy"}</p><Link href="/dashboard">Store portal <ArrowUpRight size={14}/></Link></div></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} {shop}</span><span>Educational information only. Not a diagnosis or prescription.</span></div><small className={styles.credits}>Scientific image references: Wikimedia Commons. Individual image licences and attribution should be checked before public commercial use.</small></footer>
  </main>;
}
