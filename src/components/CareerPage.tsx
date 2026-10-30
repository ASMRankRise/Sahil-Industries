'use client';

import { LegacyRuntime } from "@/components/LegacyRuntime";
import { ModernPageShell } from "@/components/ModernPageShell";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { motion } from 'framer-motion';

const hiddenValues = [
  [
    "a",
    "NjY1K3VPSys4VTBmM2gzelpaeUN1T0NMVlBrU0haTU8yZ1NqNmsyL0xtNlowcU52UWdSZzZHYXI0bzRQeE5YTg==",
  ],
  ["b", "Y1YrTnRUbDBaejVObXNlaFFEZEpteDhZa25WUXpRcFBoZG04Y1M3akp5Zz0="],
  ["c", "QnZTN1RyT0RWM09QaHZqUzlJSUkxZz09"],
  ["d", "WnZPREw0QlJmVG00MllmcHNxL0J0SVFKT3FuWk1wT3kyZ1F6SFVENGhpST0="],
  ["e", "UldVWTJiSmM2MzhjRGtVWHZ1YXBYZz09"],
  ["f", "Y29mWHExN3VNc1dRdFhaZGJ5Y1lSdz09"],
  ["g", "ZzdXc3B3YUt4TGpLejRQaHJJM0lmUDN4TTBkdXlwYU5PZGdDSmhWNkJPdz0="],
  [
    "i",
    "OW9MMk9GaHlBTGMvdERtZkQ5ZU5yVFF1bGNNRnpicHA0R0o0bHBScmdDVHRnZ1BHd3ZFZjRjc0VlTnJ3SEptUndDeGl1Q29EWW1nZjdWM0lOcUNkNmRtRVk0b3ZWVVQvV1FkZlU4WWlZTHpnMGlnOGZ0Q2VhdFg0VUMxUmZkTmE4S0p6dWoxVEdKMk56TzNqY0VSK0xxazVCbGcremtkM1VCQVJ3QjlFajVJTjN0VitWZUpsNmcxMEsxVEJzekVkRG9MZ0Fodkl4S2kwbDduTTdvS3hnZDltek5qRmt6aXZ0aTZQbFcvZjRIaz0=",
  ],
] as const;

export default function CareerPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="/agnis_webkit/captcha/css/jquery.realperson.css"
      />
      <ModernPageShell
        eyebrow="Build your career"
        title="Career at Sahil Industries">
        <section className="py-28 max-md:py-20">
          <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)] grid grid-cols-[minmax(260px,.72fr)_minmax(360px,1fr)] items-start gap-[clamp(45px,8vw,130px)] max-md:grid-cols-1">
            {/* Left Content - Staggered Reveal */}
            <RevealGroup staggerChildren={0.1} delayChildren={0.1}>
              <RevealItem variant="quickEnter">
                <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
                  <span className="h-0.5 w-8 bg-safety" />
                  Join our team
                </p>
              </RevealItem>
              <RevealItem variant="quickEnter">
                <h2 className="mb-6 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">
                  Bring your expertise to material handling.
                </h2>
              </RevealItem>
              <RevealItem variant="quickEnter">
                <p>
                  Share your details and resume with Sahil Industries. Our team
                  will contact suitable candidates.
                </p>
              </RevealItem>
            </RevealGroup>

            {/* Right Form - Staggered Reveal */}
            <Reveal variant="pageEnter" delay={0.2}>
              <form
                id="contact_form"
                name="contact_form"
                action="https://www.agnisdesigners.co.in/phpmailer/agnis_email_post.php"
                method="post"
                encType="multipart/form-data" className="space-y-5 border border-ink/20 bg-white p-[clamp(24px,4vw,46px)] shadow-safety">
                {/* Form Fields Grid - Staggered */}
                <RevealGroup staggerChildren={0.06} delayChildren={0.1} className="grid grid-cols-2 gap-x-5 gap-y-4 max-md:grid-cols-1">
                  <RevealItem variant="itemReveal">
                    <Field
                      id="fullname"
                      name="fullname"
                      type="text"
                      placeholder="Enter Name"
                    />
                  </RevealItem>
                  <RevealItem variant="itemReveal">
                    <Field
                      id="EMAIL"
                      name="email"
                      type="email"
                      placeholder="Enter Email"
                    />
                  </RevealItem>
                  <RevealItem variant="itemReveal">
                    <Field
                      id="mobile"
                      name="mobile"
                      type="text"
                      placeholder="Enter Mobile"
                    />
                  </RevealItem>
                  <RevealItem variant="itemReveal">
                    <Field
                      id="form_subject"
                      name="enquiry[array_name][City]"
                      type="text"
                      placeholder="Enter City"
                      optional
                    />
                  </RevealItem>
                </RevealGroup>

                {/* Message Field */}
                <Reveal variant="quickEnter" delay={0.3}>
                  <div className="form-group space-y-2">
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-industrial text-ink">Message</label>
                    <textarea
                      id="message"
                      name="enquiry[array_name][Message]"
                      className="form-control required min-h-[145px] w-full border border-ink/20 bg-mist px-4 py-3 text-ink outline-none focus:border-[#d2a300] focus:bg-white focus:ring-2 focus:ring-safety/20 transition-all duration-200"
                      rows={5}
                      placeholder="Enter Message"
                      maxLength={500}
                    />
                  </div>
                </Reveal>

                {/* File Upload */}
                <Reveal variant="quickEnter" delay={0.35}>
                  <div className="form-group space-y-2">
                    <label htmlFor="uploaded_file" className="block text-xs font-bold uppercase tracking-industrial text-ink">Upload your resume</label>
                    <input className="block w-full border border-dashed border-ink/25 bg-mist px-4 py-3 text-sm text-steel file:mr-4 file:border-0 file:bg-safety file:px-4 file:py-2 file:font-bold file:text-ink transition-all duration-200 hover:border-safety/50" type="file" name="uploaded_file" id="uploaded_file" />
                  </div>
                </Reveal>

                {/* Captcha */}
                <Reveal variant="quickEnter" delay={0.4}>
                  <div className="form-group space-y-2">
                    <label htmlFor="defaultReal" className="block text-xs font-bold uppercase tracking-industrial text-ink">Security verification</label>
                    <input
                      type="text"
                      id="defaultReal"
                      name="defaultReal"
                      className="form-control min-h-[54px] w-full border border-ink/20 bg-mist px-4 py-3 text-ink outline-none transition-all duration-200 focus:border-[#d2a300] focus:bg-white focus:ring-2 focus:ring-safety/20"
                      required
                    />
                  </div>
                </Reveal>

                {/* Submit Button - Magnetic Button */}
                <Reveal variant="scaleEnter" delay={0.5}>
                  <div className="form-group pt-2">
                    {hiddenValues.map(([name, value], index) => (
                      <input
                        key={`${index}-${name}`}
                        name={name}
                        type="hidden"
                        value={value}
                      />
                    ))}
                    <MagneticButton
                      type="submit"
                      name="submit"
                      id="submit"
                      strength={0.25}
                      area={80}
                      variant="primary"
                      className="w-full border-0 bg-safety px-6 py-4 text-xs font-extrabold uppercase tracking-industrial text-ink"
                    >
                      Send Your Message
                    </MagneticButton>
                  </div>
                </Reveal>
              </form>
            </Reveal>
          </div>
        </section>
      </ModernPageShell>
      <LegacyRuntime captcha core={false} />
    </>
  );
}

// Field component with focus animations
function Field({
  id,
  name,
  type,
  placeholder,
  optional = false,
}: {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <div className="form-group space-y-2">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-industrial text-ink">
        {placeholder}
      </label>
      <motion.input
        id={id}
        name={name}
        className={`form-control min-h-[54px] w-full border border-ink/20 bg-mist px-4 py-3 text-ink outline-none transition-all duration-200${optional ? "" : " required"}${type === "email" ? " email" : ""}`}
        type={type}
        placeholder={placeholder}
        whileFocus={{
          borderColor: '#F6C515',
          boxShadow: '0 0 0 3px rgba(246,197,21,0.2)',
          transition: { duration: 0.2, ease: 'easeOut' },
        }}
      />
    </div>
  );
}
