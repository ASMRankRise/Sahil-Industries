import Script from 'next/script';

const coreScripts = [
  'jquery.js', 'aos.js', 'appear.js', 'bootstrap.bundle.min.js', 'bootstrap-select.min.js',
  'isotope.js', 'jquery.countTo.js', 'jquery.easing.min.js', 'jquery.enllax.min.js',
  'jquery.fancybox.js', 'jquery.magnific-popup.min.js', 'jquery.paroller.min.js', 'jquery-ui.js',
  'knob.js', 'map-script.js', 'owl.js', 'pagenav.js', 'parallax.min.js', 'scrollbar.js',
  'TweenMax.min.js', 'validation.js', 'wow.js', 'color-switcher.min.js',
  'jquery.bootstrap-touchspin.js', 'jquery.nice-select.min.js', 'tilt.jquery.js', 'custom.js',
];

/** Loads the original interaction runtime in its original dependency order. */
export function LegacyRuntime({ captcha = false, core = true }: { captcha?: boolean; core?: boolean }) {
  return <>
    {core && coreScripts.map((file) => <Script key={file} src={`/assets/js/${file}`} strategy="afterInteractive" />)}
    {core && <Script id="legacy-preloader-init" strategy="afterInteractive">{`
      (function hideLegacyPreloader(attempt) {
        if (window.jQuery) {
          var $ = window.jQuery;
          $('.loader-wrap').delay(1000).fadeOut(500);
          if (window.TweenMax && window.Expo) {
            window.TweenMax.to($('.loader-wrap .overlay'), 1.2, {
              force3D: true,
              left: '100%',
              ease: window.Expo.easeInOut
            });
          }
        } else if (attempt < 100) {
          window.setTimeout(function () { hideLegacyPreloader(attempt + 1); }, 25);
        }
      })(0);
    `}</Script>}
    {captcha && <>
      <Script src="/agnis_webkit/bootstrap/jquery-2.2.4.min.js" strategy="afterInteractive" />
      <Script src="/agnis_webkit/captcha/js/jquery.plugin.js" strategy="afterInteractive" />
      <Script src="/agnis_webkit/captcha/js/jquery.realperson.js" strategy="afterInteractive" />
      <Script src="/agnis_webkit/bootstrap/jquery.validate.min.js" strategy="afterInteractive" />
      <Script id="legacy-captcha-init" strategy="afterInteractive">{`
        (function initialiseLegacyCaptcha(attempt) {
          if (window.jQuery && window.jQuery.fn.realperson) {
            window.jQuery('#defaultReal').realperson();
          } else if (attempt < 100) {
            window.setTimeout(function () { initialiseLegacyCaptcha(attempt + 1); }, 25);
          }
        })(0);
      `}</Script>
    </>}
  </>;
}
