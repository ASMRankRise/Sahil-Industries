const fs = require('fs');

let content = fs.readFileSync('src/components/ModernHomePage.tsx', 'utf8');

// Find the problematic section - search for the smart quote
const idx = content.indexOf('Let\u2019s build your lifting solution</Eyebrow>');
if (idx === -1) {
  console.log('Not found with smart quote');
  // Try with regular apostrophe
  const idx2 = content.indexOf("Let's build your lifting solution</Eyebrow>");
  console.log('Found with regular apostrophe:', idx2);
} else {
  console.log('Found at:', idx);
}

// Find the section start
const sectionStart = content.lastIndexOf('<section className="bg-ink py-[70px] text-white">', idx);
console.log('Section start:', sectionStart);

// Find the end
const endIdx = content.indexOf('</main>;', idx);
console.log('End index:', endIdx);

if (sectionStart !== -1 && endIdx !== -1) {
  const before = content.substring(0, sectionStart);
  
  const newSection = `    <section className="bg-ink py-[70px] text-white">
        <RevealGroup staggerChildren={0.1} delayChildren={0.1} className="mx-auto flex w-[min(1240px,calc(100%-64px))] items-center justify-between gap-8 max-md:w-[calc(100%-36px)] max-md:flex-col max-md:items-start">
          <RevealItem variant="quickEnter">
            <div>
              <motion.p
                className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="h-0.5 w-8 bg-safety" />Let's build your lifting solution
              </motion.p>
              <motion.h2
                className="max-w-2xl text-[clamp(30px,3vw,47px)] font-bold leading-[1.05] tracking-[-.05em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Ready to move your operation forward?
              </motion.h2>
            </div>
          </RevealItem>
          <RevealItem variant="quickEnter">
            <div className="flex flex-wrap items-center gap-4">
              <MagneticLink
                href="/contact"
                strength={0.2}
                area={60}
                variant="primary"
                className="inline-flex items-center gap-2 bg-safety px-5 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink"
              >
                Talk to our team <ArrowRight size={17} />
              </MagneticLink>
              <MagneticLink
                href={siteContact.phoneHref}
                strength={0.15}
                area={50}
                variant="ghost"
                className="inline-flex items-center gap-2 text-xs font-extrabold hover:text-safety"
              >
                <Phone size={17} />{siteContact.phone}
              </MagneticLink>
              <MagneticLink
                href="/sahilcrane/broucher/girder-eot-crane.pdf"
                target="_blank"
                rel="noreferrer"
                strength={0.15}
                area={50}
                variant="ghost"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-300 hover:text-safety"
              >
                <Download size={16} />Brochure
              </MagneticLink>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>

      <SiteFooter />
    </main>
  );
}`;

  const newContent = before + newSection;
  fs.writeFileSync('src/components/ModernHomePage.tsx', newContent, 'utf8');
  console.log('File fixed!');
} else {
  console.log('Could not find section boundaries');
}