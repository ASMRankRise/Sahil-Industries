'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Globe2, Share2, Mail, MapPin, Menu, Phone, Plus, ShieldCheck, Wrench, X, ZoomIn, ArrowUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const products = [
  ['single-girder-eot-crane.jpg', 'Single Girder EOT Crane'], ['double-girder-eot-crane.jpg', 'Double Girder EOT Crane'],
  ['electric-wire-rope-hoist.jpg', 'Electric Wire Rope Hoist'], ['underslung-cranes.jpg', 'Underslung Cranes'],
  ['goliath-gantry-crane.jpg', 'Goliath / Semi Goliath Crane'], ['jib-crane.jpg', 'JIB Crane'], ['monorail-crane.jpg', 'Monorail Crane'],
];
const industries = [
  ['electrical.jpg', 'Electrical'], ['heavy-engineering.jpg', 'Heavy Engineering'], ['manufacturing.jpg', 'Manufacturing'], ['nuclear-power-plant.jpg', 'Nuclear Power Plants'], ['oil-and-gas.jpg', 'Oil and Gas'], ['pre-cast-manufacturing.jpg', 'Precast Manufacturing'], ['steel-metal.jpg', 'Steel and Metal'], ['infrastructure.jpg', 'Infrastructure'], ['tunnel-shaft-making.jpg', 'Tunnel / Shaft Making'], ['ware-house.jpg', 'Warehousing'], ['forging-industry.jpg', 'Forging Industry'], ['foundry.jpg', 'Foundry'], ['government-project.jpg', 'Government Projects'], ['sugar-factory.jpg', 'Sugar Factory'], ['windmill-project.jpg', 'Wind Mill Project'], ['textile-industry.jpg', 'Textile Industry'], ['cement-pipe-industry.jpg', 'Cement Pipe Industry'],
];
const clients = ['01-ghatage-patil-industries.jpg', 'wilo.jpg', '02-kirloskar-brothers.jpg', '03-menon-and-menon-ltd.jpg', '04-sound-casting-pvt-ltd.jpg', '05-fie-spherotech.jpg', '06-caspro-metal-industries.jpg', '07-sameer-casting.jpg', '08-metallurgy-collaboration.jpg', '09-altech.jpg', '10-tulip-casting.jpg', '11-ramkrishna-foundry.jpg'];
const navItems = ['Home', 'About', 'Services', 'Clients', 'Career', 'Enquiry', 'Contact'];

const Button = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => <Link href="#" className={`button ${dark ? 'button-dark' : ''}`}>{children}<ChevronRight size={17} /></Link>;

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [top, setTop] = useState(false);
  useEffect(() => { const listener = () => setTop(window.scrollY > 500); window.addEventListener('scroll', listener); return () => window.removeEventListener('scroll', listener); }, []);
  return <main>
    <header className="site-header">
      <div className="head-grid">
        <Link href="#" className="logo-box"><Image src="/media/logo/logo.png" alt="Sahil Industries" width={183} height={72} priority /></Link>
        <div className="header-main">
          <div className="topline"><span>An ISO 9001:2008 Certified Company</span><div className="top-contact"><a href="mailto:sahilcranes@gmail.com"><Mail size={14} /> sahilcranes@gmail.com</a><Globe2 size={15} /><span className="google">G+</span><Share2 size={15} /></div></div>
          <nav className="desktop-nav">{navItems.slice(0, 2).map(x => <Link href="#" key={x} className={x === 'Home' ? 'active' : ''}>{x}</Link>)}<div className="products-nav"><button onClick={() => setProductsOpen(!productsOpen)}>Products <ChevronDown size={14}/></button>{productsOpen && <div className="dropdown">{products.map(([, title]) => <Link href="#" key={title}>{title}</Link>)}</div>}</div>{navItems.slice(2).map(x => <Link href="#" key={x}>{x}</Link>)}</nav>
        </div>
        <a className="call-box" href="tel:+919623242324"><Phone /><span><small>Make a Call</small><b>+91 96 2324 2324</b></span></a>
        <button className="mobile-toggle" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu /></button>
      </div>
    </header>
    <AnimatePresence>{menuOpen && <motion.aside className="mobile-menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}><button onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button><Image src="/media/logo/logo-footer.png" alt="Sahil Industries" width={160} height={64}/>{navItems.map(x => <Link href="#" onClick={() => setMenuOpen(false)} key={x}>{x}</Link>)}<details><summary>Products</summary>{products.map(([, title]) => <Link href="#" key={title}>{title}</Link>)}</details></motion.aside>}</AnimatePresence>

    <section className="hero">
      <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5500 }} loop pagination={{ clickable: true }} className="hero-slider">
        {['slider-01.jpg', 'slider-02.jpg'].map((image) => <SwiperSlide key={image}><div className="hero-slide" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.62), rgba(0,0,0,.13)), url(/media/slider/${image})` }}><div className="hero-content"><motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}><i /> Sahil Industries <i /></motion.p><motion.h1 initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.75, delay:.1}}>EOT Cranes <br />and Hoists Manufacturer <br />in India</motion.h1><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.25}}><Button>Read More</Button></motion.div></div></div></SwiperSlide>)}
      </Swiper>
    </section>
    <section className="highlights wrap"><div><ShieldCheck /><span><b>Reliability</b><small>Transparency Service</small></span></div><div><Wrench /><span><b>Materials</b><small>100% Quality Product</small></span></div><div><Plus /><span><b>Expert Staff</b><small>Trained & Experienced</small></span></div></section>
    <section className="about wrap section"><motion.div className="about-copy" initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><Eyebrow>EOT Cranes & Hoists Manufacturers in Kolhapur, India</Eyebrow><h2>Welcome to Sahil Industries</h2><p>We are Manufacturer & Solution Partner of EOT cranes and Hoists for industrial use as an ISO 9001-2008 certified company at Five Star MIDC, Kagal, Dist. Kolhapur since last 22 years and already having more than 100 satisfied customers using our products and an additional 100 customers to whom we are providing repairing, maintenance and servicing support of their ‘any make’ material handling equipments.</p><p>Our pre-engineered industrial cranes are designed as per IS guidelines for all classes of cranes.</p><Button dark>Read More</Button></motion.div><motion.div className="about-images" initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><strong>SAHIL</strong><Image className="about-main" src="/media/home/about-01.jpg" alt="Crane operator" width={550} height={430}/><Image className="about-small" src="/media/home/about.jpg" alt="Industrial crane" width={250} height={245}/><div className="years"><b>22<span>+</span></b><small>Years of<br/>Experienced</small></div><div className="about-mark"><Image src="/media/home/about-logo.png" alt="Sahil mark" width={68} height={68}/></div></motion.div></section>
    <section className="products-section section"><Title eyebrow="Our Products" title="Manufacturer of EOT Cranes & Hoists"/><div className="product-grid">{products.map(([image, title], i) => <motion.article className="product-card" key={title} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} transition={{delay:(i%4)*.08}} viewport={{once:true}}><div className="product-image"><Image src={`/media/products/${image}`} alt={title} fill sizes="(max-width: 700px) 100vw, 25vw"/><a href={`/media/products/${image}`} aria-label={`View ${title}`}><ZoomIn /></a></div><h3>{title}</h3></motion.article>)}</div></section>
    <section className="why section"><div className="why-bg"/><div className="wrap"><Title eyebrow="Why Choose Us" title="Reason For Choosing Us" light/><div className="why-grid">{[['Quality Assured','High Grade Material used for durable Products. Equipment’s tested with Safe working load. Latest technology used for carrying out accurate measurements.'],['Low Maintenance','High quality material and latest technology we used so minimal maintenance required for our products.'],['Customization','Specialized designs to meet your needs and increasing efficiency. Wide Customizations To Suit Your Requirements.'],['Advance Technology','We adopted advanced technology, process to manufacture our products.'],['Customer Support','We are committed to provide customer support to our valuable customers.'],['Expert Engineers','We have team of expert engineers and technicians to provide best solutions & service.']].map(([title, copy], i) => <motion.article className="why-card" key={title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><ShieldCheck/><em>0{i+1}</em><h3>{title}</h3><p>{copy}</p></motion.article>)}</div></div></section>
    <section className="section industries wrap"><Title eyebrow="Industries" title="Industries We Serve"/><Swiper modules={[Autoplay, Pagination]} autoplay={{delay:4000}} loop pagination={{clickable:true}} spaceBetween={28} breakpoints={{0:{slidesPerView:1},650:{slidesPerView:2},1000:{slidesPerView:3},1200:{slidesPerView:4}}}>{industries.map(([image, title]) => <SwiperSlide key={title}><article className="industry-card"><Image src={`/media/industries-we-serve/${image}`} alt={title} width={360} height={310}/><h3>{title}</h3></article></SwiperSlide>)}</Swiper></section>
    <section className="section clients wrap"><Title eyebrow="Our Customers" title="Our Esteemed Clients"/><div className="client-grid">{clients.map(file => <div key={file}><Image src={`/media/customers/${file}`} alt="Sahil Industries client" width={180} height={100}/></div>)}</div><div className="center"><Button dark>View All</Button></div></section>
    <section className="connect"><div className="wrap connect-inner"><div><Image src="/media/logo/logo.png" alt="Sahil Industries" width={160} height={65}/><span><b>Get Connected with Us</b><small>We Expert in Crane & EOT Manufacturing</small></span></div><div><Button>Contact Us</Button><a href="tel:+919623242324" className="phone-button"><Phone size={17}/> +91 96 2324 2324</a></div></div></section>
    <Footer />
    {top && <button className="scroll-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top"><ArrowUp size={20}/></button>}
  </main>;
}

function Eyebrow({children}:{children:React.ReactNode}) { return <div className="eyebrow"><i/>{children}<i/></div>; }
function Title({eyebrow,title,light=false}:{eyebrow:string;title:string;light?:boolean}) { return <div className={`title ${light?'light':''}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>; }
function Footer() { return <footer className="footer"><div className="footer-bg"/><div className="wrap footer-grid"><div><Image src="/media/logo/logo-footer.png" alt="Sahil Industries" width={165} height={65}/><h4>Working Time</h4><p><b>Tuesday - Sunday :</b><br/>09:00 AM - 05:30 PM</p><p><b>Monday - Closed</b></p><div className="social"><Globe2/><span>G+</span><Share2/></div></div><div><h3>Quick Links</h3>{['About','Services','Clients','Career','Enquiry','Contact'].map(x=><a href="#" key={x}>{x}</a>)}</div><div><h3>Products</h3>{products.map(([,x])=><a href="#" key={x}>{x}</a>)}</div><div><h3>Get In Touch</h3><p className="address"><MapPin/>Plot No. B 88, 89, 90 Kagal Hatkanagale Five Star MIDC, Village – Halsawade, Tal.- Karveer, Dist.- Kolhapur - 416 236.</p><p className="address"><Phone/><a href="tel:+919623242324">+91 96 2324 2324</a></p><p className="address"><Mail/><a href="mailto:sahilcranes@gmail.com">sahilcranes@gmail.com</a></p></div></div><div className="copyright">Copyright © 2023 <b>Sahil Industries.</b> All Rights Reserved.</div></footer>; }

import { useEffect, useState } from 'react';
