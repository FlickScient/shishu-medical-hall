import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Pill, FlaskConical, Building2, BookOpen, ExternalLink } from "lucide-react";

const sources=[
 {title:"Brand directory",bn:"ব্র্যান্ড তালিকা",desc:"Search Bangladesh medicine brand names, strengths, dosage forms and manufacturers.",url:"https://medex.com.bd/index.php/brands",icon:Pill,no:"01"},
 {title:"Generic directory",bn:"জেনেরিক তালিকা",desc:"Explore active ingredients and the brands associated with each generic.",url:"https://medex.com.bd/generics",icon:FlaskConical,no:"02"},
 {title:"Pharmaceutical companies",bn:"ঔষধ কোম্পানি",desc:"Browse manufacturers and explore their medicine portfolios.",url:"https://medex.com.bd/companies",icon:Building2,no:"03"}
];

export default function MedicinesPage(){
 return <main className="subpage-shell">
  <header className="subpage-header"><Link href="/" className="subpage-brand"><img src="/logo.jpg" alt=""/>Shishu Medical Hall</Link><nav><Link href="/medicines">Medicines</Link><Link href="/pharma">Pharma</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health Library</Link><Link href="/dashboard">Store portal</Link></nav></header>
  <section className="subpage-hero subpage-hero-grid medicine-hero">
   <div className="subpage-hero-copy"><Link href="/" className="back-link"><ArrowLeft size={15}/> Home</Link><span className="section-kicker">MEDICINE EXPLORER / BANGLADESH</span><h1>Every medicine<br/><span>has a story.</span></h1><p>Explore brand names, generic ingredients, strengths, dosage forms and manufacturers through the MedEx Bangladesh reference index.</p><div className="source-note"><span className="source-dot"/> External reference: MedEx Bangladesh <a href="https://medex.com.bd/" target="_blank" rel="noreferrer">Open MedEx <ExternalLink size={13}/></a></div></div>
   <div className="subpage-hero-art medicine-hero-art"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Pills.JPG?width=1400" alt="Medicine tablets and capsules arranged for a pharmaceutical reference study"/><span>REFERENCE PLATE / 01</span><b>BRANDS · GENERICS · STRENGTHS</b><i className="hero-art-ring"/><i className="hero-art-ring ring-two"/></div>
  </section>
  <section className="directory-intro"><span className="section-kicker">THE REFERENCE INDEX</span><h2>Choose your starting point.</h2><p>These links open the corresponding live MedEx directories. This website does not claim to host or reproduce the MedEx database.</p></section>
  <section className="directory-grid">{sources.map(({title,bn,desc,url,icon:Icon,no})=><a href={url} target="_blank" rel="noreferrer" className="directory-card" key={title}><span className="directory-number">{no}</span><span className="directory-icon"><Icon size={22}/></span><small>MEDEX DIRECTORY</small><h2>{title}</h2><strong>{bn}</strong><p>{desc}</p><span className="directory-link">Browse on MedEx <ArrowUpRight size={15}/></span></a>)}</section>
  <section className="medicine-disclaimer"><BookOpen size={20}/><div><strong>About the medicine data</strong><p>MedEx is the linked reference source for this explorer. It opens MedEx's live directories; it does not copy or cache their database. An authorised API or data licence is needed before importing records directly. Medicine information is for reference only, not diagnosis or prescribing.</p></div></section>
  <footer className="subpage-footer">© {new Date().getFullYear()} Shishu Medical Hall · <Link href="/">Back to home</Link></footer>
 </main>;
}
