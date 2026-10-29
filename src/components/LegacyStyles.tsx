const styles = [
  'animate.css', 'aos.css', 'bootstrap.min.css', 'bootstrap-select.min.css', 'custom-animate.css',
  'fancybox.min.css', 'flaticon.css', 'font-awesome.min.css', 'imp.css', 'jquery-ui.css',
  'magnific-popup.css', 'owl.css', 'rtl.css', 'scrollbar.css', 'icomoon.css',
  'jquery.bootstrap-touchspin.css', 'nice-select.css', 'module-css/header-section.css',
  'module-css/banner-section.css', 'module-css/about-section.css', 'module-css/blog-section.css',
  'module-css/fact-counter-section.css', 'module-css/faq-section.css', 'module-css/contact-page.css',
  'module-css/breadcrumb-section.css', 'module-css/team-section.css', 'module-css/partner-section.css',
  'module-css/testimonial-section.css', 'module-css/services-section.css', 'module-css/footer-section.css',
  'color/theme-color.css', 'style.css', 'color-2.css', 'responsive.css', 'agnis-style.css',
];

/** The unmodified legacy stylesheet stack, retained for visual parity during migration. */
export function LegacyStyles({ captcha = false }: { captcha?: boolean }) {
  return <>{captcha && <link rel="stylesheet" href="/agnis_webkit/captcha/css/jquery.realperson.css" />}{styles.map((file) => <link key={file} rel="stylesheet" href={`/assets/css/${file}`} />)}</>;
}
