import { LegacyRuntime } from '@/components/LegacyRuntime';
import { LegacyStyles } from '@/components/LegacyStyles';
import { clientLogos, homeProducts, industries } from '@/data/home';
import { reasonsToChoose } from '@/data/about';
import { primaryNavigation } from '@/data/site';

const asset = (path: string) => `/sahilcrane/${path}`;
const productLinks = homeProducts.map((product) => ({ ...product, href: product.href ?? '/' }));

export default function HomePage() {
  return <>
    <LegacyStyles />
    <div className="boxed_wrapper ltr">
      <LegacyPreloader />
      <LegacyHeader />
      <HeroSlider />
      <Highlights />
      <AboutSection />
      <ProductsSection />
      <WhyChooseSection />
      <IndustriesSection />
      <ClientsSection />
      <ContactCta />
      <LegacyFooter />
      <button className="scroll-top scroll-to-target" data-target="html"><span className="flaticon-up-arrow" /></button>
    </div>
    <LegacyRuntime />
  </>;
}

export function LegacyPreloader() {
  return <div className="loader-wrap"><div className="preloader"><div className="preloader-close">Preloader Close</div></div><div className="layer layer-one"><span className="overlay" /></div><div className="layer layer-two"><span className="overlay" /></div><div className="layer layer-three"><span className="overlay" /></div></div>;
}

function Navigation() {
  const product = primaryNavigation.find((item) => item.label === 'Products');
  return <ul className="navigation clearfix">
    <li className="current"><a href="/">Home</a></li><li><a href="/about">About</a></li>
    <li className="dropdown"><a href="#">Products</a><ul>{product?.children?.map((item) => <li key={item.href}><a href={item.href}> {item.label} </a></li>)}</ul></li>
    {primaryNavigation.filter((item) => item.label !== 'Home' && item.label !== 'About' && item.label !== 'Products').map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}
  </ul>;
}

export function LegacyHeader() {
  return <header className="main-header header-style-three"><div className="header-style-three__inner">
    <div className="main-logo-box-three"><div className="logo-bg" /><a href="/"><img className="img-logo" src={asset('logo/logo.png')} alt="Awesome Logo" title="" /></a></div>
    <div className="header-style-three__header-content"><div className="header-top-style3"><div className="container"><div className="outer-box"><div className="header-top-style3__left"><div className="welcome-text"><p>An ISO 9001:2008 Certified Company </p></div></div><div className="header-top-style3__right"><div className="header-contact-info header-contact-info--style2 text-right-rtl"><ul><li><div className="icon"><span className="flaticon-email-1" /></div><div className="text"><h6><a href="mailto:sahilcranes@gmail.com">sahilcranes@gmail.com</a></h6></div></li></ul></div><div className="header-social-link-style2"><ul className="clearfix"><li><a href="#"><i className="fa fa-facebook" aria-hidden="true" /></a></li><li><a href="#"><i className="fa fa-google" aria-hidden="true" /></a></li><li><a href="#"><i className="fa fa-linkedin" aria-hidden="true" /></a></li></ul></div></div></div></div></div>
      <div className="header-style3"><div className="container"><div className="outer-box"><div className="nav-outer style3 clearfix"><div className="mobile-nav-toggler"><div className="inner"><span className="icon-bar" /><span className="icon-bar" /><span className="icon-bar" /></div></div><nav className="main-menu style3 navbar-expand-md navbar-light"><div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent"><Navigation /></div></nav></div></div></div></div>
    </div><div className="header-contact-info3"><div className="icon"><span className="flaticon-telephone" /></div><div className="text"><p>Make a Call</p><h3><a href="tel:+919623242324">+91 96 2324 2324 </a></h3></div></div>
  </div><div className="sticky-header"><div className="container"><div className="clearfix"><div className="logo float-left py-2"><a href="/" className="img-responsive"><img src={asset('logo/logo1.png')} alt="" title="" /></a></div><div className="right-col float-right"><nav className="main-menu clearfix" /></div></div></div></div><div className="mobile-menu"><div className="menu-backdrop" /><div className="close-btn"><span className="icon fa fa-times-circle" /></div><nav className="menu-box"><div className="nav-logo"><a href="/"><img src={asset('logo/logo-footer.png')} alt="" title="" /></a></div><div className="menu-outer" /><div className="social-links"><ul className="clearfix"><li><a href="#"><span className="fab fa fa-facebook-square" /></a></li><li><a href="#"><span className="fab fa fa-linkedin" /></a></li><li><a href="#"><span className="fab fa fa-google" /></a></li></ul></div></nav></div></header>;
}

function HeroSlider() {
  return <section className="main-slider style3"><div className="slider-box"><div className="banner-carousel owl-theme owl-carousel">{['slider-01.jpg', 'slider-02.jpg'].map((image) => <div className="slide" key={image}><div className="image-layer" style={{ backgroundImage: `url(${asset(`slider/${image}`)})` }} /><div className="auto-container"><div className="content"><div className="sub-title"><div className="border-box-left" /><h6 className="text-white">Sahil Industries</h6><div className="border-box-right" /></div><div className="big-title"><h2>EOT Cranes <br /> and Hoists Manufacturer <br /> in India </h2></div><div className="btns-box"><a className="btn-one" href="/about"><span className="txt">Read More</span></a></div></div></div></div>)}</div></div></section>;
}

function Highlights() {
  const entries = [['flaticon-protection', 'Reliability', 'Transparency Service'], ['flaticon-quality', 'Materials', '100% Quality Product'], ['flaticon-construction-and-tools', 'Expert Staff', 'Trained & Expereinced']];
  return <section className="highlights-area"><div className="container"><div className="highlights__content"><ul>{entries.map(([icon, title, copy]) => <li className="single-highlights-box" key={title}><div className="inner"><div className="icon"><span className={icon} /></div><div className="text"><h3>{title}</h3><p>{copy}</p></div></div><div className="counting-box" /></li>)}</ul></div></div></section>;
}

function AboutSection() {
  return <section className="about-style2-area"><div className="container"><div className="row"><div className="col-xl-6"><div className="about-style2__content"><div className="sec-title"><div className="sub-title"><h1 className="heading"><span className="border-left" />EOT Cranes &amp; Hoists Manufacturers in Kolhapur, India</h1></div><h2>Welcome to Sahil Industries</h2></div><div className="inner-content"><div className="text"><p className="mb-3 text-justify">We are Manufacturer &amp; Solution Partner of EOT cranes and Hoists for industrial use as an ISO 9001-2008 certified company at Five Star MIDC , Kagal, Dist. Kolhapur since last 22 years and already having more than 100 satisfied customers using our products and an additional 100 customers to whom we are providing repairing, maintenance and servicing support of their &apos;any make&apos; material handling equipments. </p><p className="text-justify mb-5">Our pre-engineered industrial cranes are designed as per IS guidelines for all classes of cranes. </p><a className="btn-one two" href="/about"><span className="txt">Read More</span></a></div></div></div></div><div className="col-xl-6"><div className="about-style2__image-box"><div className="big-title paroller">SAHIL</div><div className="img-box1 js-tilt"><img src={asset('home/about-01.jpg')} alt="Image" /></div><div className="img-box2"><div className="inner"><img src={asset('home/about.jpg')} alt="Image" /></div></div><div className="overlay-box"><h2>22<span className="flaticon-plus-1" /></h2><h3>Years of<br /> Experienced</h3></div><div className="icon-box"><img src={asset('home/about-logo.png')} alt="Logo" /></div></div></div></div></div></section>;
}

function ProductsSection() {
  return <section className="service-style2-area"><div className="container-fluid"><SectionTitle eyebrow="Our Products" title="Manufacturer of EOT Cranes & Hoists" /> <div className="row text-right-rtl justify-content-center">{productLinks.map((product, index) => <div className="col-xl-3 col-lg-4 col-md-12" key={product.title}><div className={`single-project-item-style2${index > 2 ? ' mb-lg-0' : ''}`}><div className="img-holder"><div className="inner"><img src={asset(`products/${product.image}`)} alt={product.title} /></div><div className="overlay-content text-center"><a className="lightbox-image" data-fancybox="gallery" href={asset(`products/${product.image}`)}><i className="flaticon-zoom" /></a></div></div><div className="text-holder"><div className="pattern-bg" style={{ backgroundImage: 'url(/assets/images/pattern/thm-pattern-7.png)' }} /><div className="left"><h3><a href={product.href}>{product.title}</a></h3></div></div></div></div>)}</div></div></section>;
}

function WhyChooseSection() {
  return <section className="choose-style2-area"><div className="choose-style2-area-bg" style={{ backgroundImage: 'url(/assets/images/parallax-background/choose-style2-area-bg.jpg)' }} /><div className="container"><SectionTitle eyebrow="Why Choose Us" title="Reason For Choosing Us" light /><div className="row">{reasonsToChoose.map(([title, copy], index) => <div className={`col-xl-4${index < 5 ? ' mb-5' : ''}`} key={title}><div className="single-choose-box"><div className="inner"><div className="icon"><span className="flaticon-quality" /></div><div className="counting-box">{String(index + 1).padStart(2, '0')}</div><div className="text"><h3>{title}</h3><p>{copy}</p></div></div></div></div>)}</div></div></section>;
}

function IndustriesSection() {
  return <section className="blog-style2-area"><div className="container"><SectionTitle eyebrow="Industries" title="Industries We Serve" /><div className="row text-right-rtl"><div className="col-xl-12 col-lg-12"><div className="theme_carousel blog-style2-carousel owl-dot-style1 owl-theme owl-carousel" data-options={'{"loop":true,"margin":30,"autoheight":true,"lazyload":true,"nav":false,"dots":true,"autoplay":true,"autoplayTimeout":5000,"smartSpeed":500,"responsive":{"0":{"items":"1"},"600":{"items":"1"},"768":{"items":"1"},"992":{"items":"2"},"1200":{"items":"4"}}}'}>{industries.map((industry) => <div className="single-blog-style1 single-blog-style2 wow fadeInUp" data-wow-delay="100ms" data-wow-duration="1500ms" key={industry.title}><div className="img-holder"><div className="gradient-bg" /><div className="inner"><img src={asset(`industries-we-serve/${industry.image}`)} alt={industry.title} /></div><div className="overlay-content"><h3 className="blog-title text-white"> {industry.title}</h3></div></div></div>)}</div></div></div></div></section>;
}

function ClientsSection() {
  return <section className="service-style2-area"><div className="container"><SectionTitle eyebrow="Our Customers" title="Our Esteemed Clients" /><div className="row justify-content-center">{clientLogos.map((logo) => <div className="col-6 col-lg-2 mb-5" key={logo}><img src={asset(`customers/${logo}`)} alt="Sahil Industries customer" className="border1" /></div>)}<div className="col-lg-12 mt-5 text-center"><a className="btn-one two" href="/clients"><span className="txt">View All</span></a></div></div></div></section>;
}

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return <div className="sec-title center text-center"><div className="sub-title"><h6><span className="border-left" />{eyebrow}{eyebrow === 'Our Products' && <span className="border-right" />}</h6></div><h2 className={light ? 'text-white' : ''}>{title}</h2></div>;
}

export function ContactCta() { return <div className="footer-top footer-top1"><div className="container"><div className="row"><div className="col-xl-12 col-md-12"><div className="footer-top__content"><div className="left-box"><div className="footer-logo"><a href="/"><img src={asset('logo/logo.png')} alt="" /></a></div><div className="title"><h3>Get Connected with Us</h3><p className="text-dark">We Expert in Crane &amp; EOT Manufacturing</p></div></div><div className="right-box"><a className="btn-one btn-one1 text-one" href="/contact"><span className="txt">Contact Us</span></a><a className="btn-one btn-one1 text-one" href="tel:+919623242324"><span className="flaticon-headphone" /><span className="txt">&nbsp; +91 96 2324 2324</span></a></div></div></div></div></div></div>; }

export function LegacyFooter() { const products = primaryNavigation.find((item) => item.label === 'Products')?.children ?? []; return <footer className="footer-area footer-area--style3"><div className="footer-style3"><div className="footer-style3-bg" style={{ backgroundImage: 'url(/assets/images/footer/footer-style3-bg.jpg)' }} /><div className="container"><div className="row text-right-rtl"><div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 wow animated fadeInUp" data-wow-delay="0.1s"><div className="single-footer-widget single-footer-widget--style3 marbtm50"><div className="our-company-info"><div className="footer-logo"><a href="/"><img src={asset('logo/logo-footer.png')} alt="" /></a></div><div className="text-box pb-0"><h5 className="text-white pb-2">Working Time</h5><p className="pb-3" style={{ borderBottom: '1px dashed #ccc' }}><strong>Tuesday - Sunday :</strong><br />09:00 AM - 05:30 PM</p><p className="pt-2"><strong>Monday - Closed</strong></p></div></div></div></div><FooterLinks title="Quick Links" links={primaryNavigation.filter((item) => !['Home', 'Products'].includes(item.label))} /><FooterLinks title="Products" links={products} /><div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 wow animated fadeInUp" data-wow-delay="0.5s"><div className="single-footer-widget single-footer-widget--style3 pdtop50"><div className="title"><h3>Get In Touch</h3></div><div className="footer-widget-contact-info footer-widget-contact-info--style2"><ul><li><div className="inner-icon"><span className="flaticon-placeholder-2" /></div><div className="inner-text"><h6>Address</h6><p>Plot No. B 88, 89, 90 Kagal Hatkanagale Five Star MIDC , Village – Halsawade, Tal.- Karveer , Dist.- Kolhapur - 416 236.</p></div></li><li><div className="inner-icon"><span className="flaticon-phone-call-3" /></div><div className="inner-text"><h6>Call Us </h6><p><a href="tel:+919623242324">+91 96 2324 2324</a></p></div></li><li><div className="inner-icon"><span className="flaticon-email" /></div><div className="inner-text"><h6>Email Us </h6><p><a href="mailto:sahilcranes@gmail.com">sahilcranes@gmail.com</a></p></div></li></ul></div></div></div></div></div><div className="footer-bottom-style3"><div className="container"><div className="footer-bottom-style3__content text-center"><div className="copyright"><p>Copyright © 2023<a href="/"> <strong>Sahil Industries.</strong></a> All Rights Reserved.</p></div></div></div></div></div></footer>; }

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) { return <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 wow animated fadeInUp" data-wow-delay="0.3s"><div className="single-footer-widget single-footer-widget--style3 mb-5 mb-lg-0"><div className="title"><h3>{title}</h3></div><div className="footer-widget-links-2"><ul className="pull-left left">{links.map((link) => <li key={link.href}><a href={link.href}> {link.label} </a></li>)}</ul></div></div></div>; }
