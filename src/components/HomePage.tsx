'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Phone, Plus, ShieldCheck, Wrench, ZoomIn, ArrowUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { clientLogos, homeProducts, industries } from '@/data/home';
import 'swiper/css';
import 'swiper/css/pagination';

const Button = ({ children, dark = false, href = '#' }: { children: React.ReactNode; dark?: boolean; href?: string }) => <Link href={href} className={`button ${dark ? 'button-dark' : ''}`}>{children}<ChevronRight size={17} /></Link>;

export default function HomePage() {
  const [top, setTop] = useState(false);
  useEffect(() => { const listener = () => setTop(window.scrollY > 500); window.addEventListener('scroll', listener); return () => window.removeEventListener('scroll', listener); }, []);
  return <main>
    <SiteHeader />

    <section className="hero">
      <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5500 }} loop pagination={{ clickable: true }} className="hero-slider">
        {['slider-01.jpg', 'slider-02.jpg'].map((image) => <SwiperSlide key={image}><div className="hero-slide" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.62), rgba(0,0,0,.13)), url(/media/slider/${image})` }}><div className="hero-content"><motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}><i /> Sahil Industries <i /></motion.p><motion.h1 initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.75, delay:.1}}>EOT Cranes <br />and Hoists Manufacturer <br />in India</motion.h1><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.25}}><Button>Read More</Button></motion.div></div></div></SwiperSlide>)}
      </Swiper>
    </section>
    <section className="highlights wrap"><div><ShieldCheck /><span><b>Reliability</b><small>Transparency Service</small></span></div><div><Wrench /><span><b>Materials</b><small>100% Quality Product</small></span></div><div><Plus /><span><b>Expert Staff</b><small>Trained & Experienced</small></span></div></section>
    <section className="about wrap section"><motion.div className="about-copy" initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><Eyebrow>EOT Cranes & Hoists Manufacturers in Kolhapur, India</Eyebrow><h2>Welcome to Sahil Industries</h2><p>We are Manufacturer & Solution Partner of EOT cranes and Hoists for industrial use as an ISO 9001-2008 certified company at Five Star MIDC, Kagal, Dist. Kolhapur since last 22 years and already having more than 100 satisfied customers using our products and an additional 100 customers to whom we are providing repairing, maintenance and servicing support of their ‘any make’ material handling equipments.</p><p>Our pre-engineered industrial cranes are designed as per IS guidelines for all classes of cranes.</p><Button dark>Read More</Button></motion.div><motion.div className="about-images" initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><strong>SAHIL</strong><Image className="about-main" src="/media/home/about-01.jpg" alt="Crane operator" width={550} height={430}/><Image className="about-small" src="/media/home/about.jpg" alt="Industrial crane" width={250} height={245}/><div className="years"><b>22<span>+</span></b><small>Years of<br/>Experienced</small></div><div className="about-mark"><Image src="/media/home/about-logo.png" alt="Sahil mark" width={68} height={68}/></div></motion.div></section>
    <section className="products-section section"><Title eyebrow="Our Products" title="Manufacturer of EOT Cranes & Hoists"/><div className="product-grid">{homeProducts.map(({ image, title }, i) => <motion.article className="product-card" key={title} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} transition={{delay:(i%4)*.08}} viewport={{once:true}}><div className="product-image"><Image src={`/media/products/${image}`} alt={title} fill sizes="(max-width: 700px) 100vw, 25vw"/><a href={`/media/products/${image}`} aria-label={`View ${title}`}><ZoomIn /></a></div><h3>{title}</h3></motion.article>)}</div></section>
    <section className="why section"><div className="why-bg"/><div className="wrap"><Title eyebrow="Why Choose Us" title="Reason For Choosing Us" light/><div className="why-grid">{[['Quality Assured','High Grade Material used for durable Products. Equipment’s tested with Safe working load. Latest technology used for carrying out accurate measurements.'],['Low Maintenance','High quality material and latest technology we used so minimal maintenance required for our products.'],['Customization','Specialized designs to meet your needs and increasing efficiency. Wide Customizations To Suit Your Requirements.'],['Advance Technology','We adopted advanced technology, process to manufacture our products.'],['Customer Support','We are committed to provide customer support to our valuable customers.'],['Expert Engineers','We have team of expert engineers and technicians to provide best solutions & service.']].map(([title, copy], i) => <motion.article className="why-card" key={title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><ShieldCheck/><em>0{i+1}</em><h3>{title}</h3><p>{copy}</p></motion.article>)}</div></div></section>
    <section className="section industries wrap"><Title eyebrow="Industries" title="Industries We Serve"/><Swiper modules={[Autoplay, Pagination]} autoplay={{delay:4000}} loop pagination={{clickable:true}} spaceBetween={28} breakpoints={{0:{slidesPerView:1},650:{slidesPerView:2},1000:{slidesPerView:3},1200:{slidesPerView:4}}}>{industries.map(({ image, title }) => <SwiperSlide key={title}><article className="industry-card"><Image src={`/media/industries-we-serve/${image}`} alt={title} width={360} height={310}/><h3>{title}</h3></article></SwiperSlide>)}</Swiper></section>
    <section className="section clients wrap"><Title eyebrow="Our Customers" title="Our Esteemed Clients"/><div className="client-grid">{clientLogos.map(file => <div key={file}><Image src={`/media/customers/${file}`} alt="Sahil Industries client" width={180} height={100}/></div>)}</div><div className="center"><Button dark>View All</Button></div></section>
    <section className="connect"><div className="wrap connect-inner"><div><Image src="/media/logo/logo.png" alt="Sahil Industries" width={160} height={65}/><span><b>Get Connected with Us</b><small>We Expert in Crane & EOT Manufacturing</small></span></div><div><Button>Contact Us</Button><a href="tel:+919623242324" className="phone-button"><Phone size={17}/> +91 96 2324 2324</a></div></div></section>
    <SiteFooter />
    {top && <button className="scroll-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top"><ArrowUp size={20}/></button>}
  </main>;
}

function Eyebrow({children}:{children:React.ReactNode}) { return <div className="eyebrow"><i/>{children}<i/></div>; }
function Title({eyebrow,title,light=false}:{eyebrow:string;title:string;light?:boolean}) { return <div className={`title ${light?'light':''}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>; }
