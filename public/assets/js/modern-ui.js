/* Presentation-only GSAP layer. It never changes navigation, form, download, or API behavior. */
(function () {
  if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.from('.main-header', { y: -22, autoAlpha: 0, duration: .55, ease: 'power2.out', clearProps: 'all' });
  window.gsap.utils.toArray('.sec-title, .service-details-content .top, .single-contact-info-box, .single-project-item-style2, .single-choose-box, .single-blog-style2').forEach(function (element) {
    window.gsap.from(element, { scrollTrigger: { trigger: element, start: 'top 88%', once: true }, y: 28, autoAlpha: 0, duration: .65, ease: 'power2.out', clearProps: 'all' });
  });
  window.gsap.utils.toArray('.border1').forEach(function (element, index) {
    window.gsap.from(element, { scrollTrigger: { trigger: element, start: 'top 92%', once: true }, scale: .92, autoAlpha: 0, delay: (index % 6) * .035, duration: .42, ease: 'power2.out', clearProps: 'all' });
  });
}());
