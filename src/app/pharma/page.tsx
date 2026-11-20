import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, FlaskConical, Microscope, Factory, BookOpen } from "lucide-react";

const items=[
 {icon:Building2,no:"01",title:"Pharmaceutical companies",desc:"Explore Bangladesh manufacturers, their history and medicine portfolios.",href:"https://medex.com.bd/companies",label:"Company directory",type:"COMPANIES"},
 {icon:FlaskConical,no:"02",title:"Generics & active ingredients",desc:"Understand how active ingredients connect to brands and dosage forms.",href:"https://medex.com.bd/generics",label:"Generic index",type:"MOLECULES"},
 {icon:Factory,no:"03",title:"Medicine manufacturing",desc:"Follow the path from raw materials to formulation, quality checks and packaging.",href:"/bio-intelligent",label:"Explore the science",type:"PRODUCTION"},
 {icon:Microscope,no:"04",title:"Therapeutic classes",desc:"Explore medicine categories and the science behind different treatment areas.",href:"https://medex.com.bd/",label:"Visit MedEx",type:"THERAPEUTICS"}
];

export default function PharmaPage(){
 return <main className="subpage-shell">
  <header className="subpage-header"><Link href="/" className="subpage-brand"><img src="/logo.jpg" alt=""/>Shishu Medical Hall</Link><nav><Link href="/medicines">Medicines</Link><Link href="/pharma">Pharma</Link><Link href="/bio-intelligent">Bio Intelligent</Link><Link href="/health-library">Health Library</Link><Link href="/dashboard">Store portal</Link></nav></header>
  <section className="subpage-hero subpage-hero-grid pharma-hero">
   <div className="subpage-hero-copy"><Link href="/" className="back-link"><ArrowLeft size={15}/> Home</Link><span className="section-kicker">PHARMACEUTICAL SCIENCE / FIELD NOTES</span><h1>From molecule<br/><span>to medicine.</span></h1><p>Explore the people, ingredients, manufacturing systems and research that shape modern pharmaceutical care in Bangladesh.</p><div className="hero-meta-line"><span>01 / DISCOVERY</span><span>02 / FORMULATION</span><span>03 / QUALITY</span></div></div>
   <div className="subpage-hero-art pharma-hero-art"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/A_pharmaceutical_laboratory_with_books_and_equipment_on_a_lo_Wellcome_V0029788.jpg?width=1600" alt="Pharmaceutical laboratory research equipment"/><span>RESEARCH / 02</span><b>DISCOVERY TO FORMULATION</b><i className="hero-art-ring"/><i className="hero-art-ring ring-two"/></div>
  </section>
  <section className="directory-intro"><span className="section-kicker">THE PHARMACEUTICAL LANDSCAPE</span><h2>Four ways into the science.</h2><p>Start with the manufacturer, the active ingredient or the process that turns research into a quality-controlled product.</p></section>
  <section className="pharma-grid">{items.map(({icon:Icon,no,title,desc,href,label,type})=><article className="pharma-card" key={title}><span className="pharma-number">{no}</span><span className="pharma-type">{type}</span><span className="directory-icon"><Icon size={22}/></span><h2>{title}</h2><p>{desc}</p><Link href={href} target={href.startsWith("http")?"_blank":undefined}>{label} <ArrowUpRight size={15}/></Link></article>)}</section>
  <section className="pharma-callout"><BookOpen size={24}/><div><h2>Learn with context</h2><p>Medicine directories are references, not treatment instructions. Clinical decisions should always be made with qualified healthcare professionals.</p></div></section>
  <footer className="subpage-footer">© {new Date().getFullYear()} Shishu Medical Hall · <Link href="/">Back to home</Link></footer>
 </main>;
}
