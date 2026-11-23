import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

type LegalPageProps = { type: "privacy" | "terms" };

const content = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "Sahil Industries respects your privacy and is committed to protecting the information you share with us.",
    sections: [
      [
        "Information we collect",
        "When you contact us, submit an enquiry, or apply for a position, we may collect your name, email address, phone number, company or city, message, and any files you choose to upload.",
      ],
      [
        "How we use information",
        "We use this information to respond to enquiries, prepare quotations, provide services, process career applications, improve our website, and communicate with you about your request.",
      ],
      [
        "Sharing and storage",
        "We do not sell your personal information. Information may be handled by trusted service providers needed to operate our website, email, hosting, and database systems. We retain information only as long as reasonably necessary for these purposes or as required by law.",
      ],
      [
        "Security",
        "We use reasonable administrative and technical safeguards to protect submitted information. However, no online transmission or storage system can be guaranteed to be completely secure.",
      ],
      [
        "Your choices",
        "You may contact us to request access to, correction of, or deletion of personal information that you have submitted, subject to applicable legal requirements.",
      ],
    ],
  },
  terms: {
    title: "Terms of Service",
    intro:
      "These terms describe the conditions for using the Sahil Industries website and its enquiry services.",
    sections: [
      [
        "Website use",
        "You may use this website for lawful business and informational purposes. You must not misuse the website, interfere with its operation, or submit false, harmful, or unauthorized content.",
      ],
      [
        "Products and quotations",
        "Product descriptions, images, specifications, availability, prices, and delivery estimates are provided for general information and may change. A quotation or project agreement is subject to separate written confirmation from Sahil Industries.",
      ],
      [
        "Enquiries and applications",
        "Submitting an enquiry does not create a contract or guarantee a quotation, employment, service appointment, or purchase. Please ensure that information and uploaded documents are accurate and that you have permission to share them.",
      ],
      [
        "Intellectual property",
        "The content, branding, images, and materials on this website belong to Sahil Industries or their respective owners and may not be copied or reused without permission.",
      ],
      [
        "Disclaimer and liability",
        "The website is provided on an as-available basis. To the extent permitted by law, Sahil Industries is not liable for indirect loss arising from reliance on general website information or temporary unavailability.",
      ],
      [
        "Changes and contact",
        "We may update these terms from time to time. Questions about these terms can be sent to sahilcranes@gmail.com.",
      ],
    ],
  },
} as const;

export default function LegalPage({ type }: LegalPageProps) {
  const page = content[type];
  return (
    <>
      <main className="min-h-screen bg-white">
        <section className="bg-[#0c3152] py-24 text-white max-md:py-16">
          <div className="wrap">
            <p className="eyebrow">Sahil Industries</p>
            <h1 className="text-4xl font-extrabold max-md:text-3xl">
              {page.title}
            </h1>
            <p className="mt-4 max-w-2xl text-slate-200">
              Last updated: November 2026
            </p>
          </div>
        </section>
        <article className="wrap max-w-4xl py-16 max-md:py-12">
          <p className="mb-10 text-lg leading-8 text-slate-600">{page.intro}</p>
          <div className="space-y-8">
            {page.sections.map(([heading, text]) => (
              <section key={heading}>
                <h2 className="mb-3 text-2xl font-bold text-[#17283a]">
                  {heading}
                </h2>
                <p className="leading-8 text-slate-600">{text}</p>
              </section>
            ))}
          </div>
          <p className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
            For questions, contact{" "}
            <a
              className="text-[#b48600] hover:underline"
              href="mailto:sahilcranes@gmail.com">
              sahilcranes@gmail.com
            </a>
            .{" "}
            <Link className="ml-2 text-[#b48600] hover:underline" href="/">
              Return to home
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
