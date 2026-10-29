import { LegacyRuntime } from "@/components/LegacyRuntime";
import { ModernPageShell } from "@/components/ModernPageShell";

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
            <div>
              <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
                <span />
                Join our team
              </p>
              <h2 className="mb-6 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">
                Bring your expertise to material handling.
              </h2>
              <p>
                Share your details and resume with Sahil Industries. Our team
                will contact suitable candidates.
              </p>
            </div>
            <form
              id="contact_form"
              name="contact_form"
              action="https://www.agnisdesigners.co.in/phpmailer/agnis_email_post.php"
              method="post"
              encType="multipart/form-data" className="border border-ink/20 bg-white p-[clamp(24px,4vw,46px)] shadow-safety">
              <div className="grid grid-cols-2 gap-x-[18px] max-md:grid-cols-1">
                <Field
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="Enter Name"
                />
                <Field
                  id="EMAIL"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                />
                <Field
                  id="mobile"
                  name="mobile"
                  type="text"
                  placeholder="Enter Mobile"
                />
                <Field
                  id="form_subject"
                  name="enquiry[array_name][City]"
                  type="text"
                  placeholder="Enter City"
                  optional
                />
              </div>
              <div className="form-group">
                <textarea
                  id="message"
                  name="enquiry[array_name][Message]"
                  className="form-control required min-h-[145px] w-full border border-ink/20 bg-mist px-4 py-3 text-ink outline-none focus:border-[#d2a300] focus:bg-white focus:ring-2 focus:ring-safety/20"
                  rows={5}
                  placeholder="Enter Message"
                  maxLength={500}
                />
              </div>
              <div className="form-group">
                <label htmlFor="uploaded_file">Upload your resume</label>
                <input type="file" name="uploaded_file" id="uploaded_file" />
              </div>
              <div className="form-group">
                <label htmlFor="defaultReal">Security verification</label>
                <input
                  type="text"
                  id="defaultReal"
                  name="defaultReal"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                {hiddenValues.map(([name, value], index) => (
                  <input
                    key={`${index}-${name}`}
                    name={name}
                    type="hidden"
                    value={value}
                  />
                ))}
                <input
                  type="submit"
                  name="submit"
                  id="submit"
                  value="Send Your Message"
                />
              </div>
            </form>
          </div>
        </section>
      </ModernPageShell>
      <LegacyRuntime captcha core={false} />
    </>
  );
}

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
    <div className="form-group">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        className={`form-control min-h-[54px] w-full border border-ink/20 bg-mist px-4 py-3 text-ink outline-none transition focus:border-[#d2a300] focus:bg-white focus:ring-2 focus:ring-safety/20${optional ? "" : " required"}${type === "email" ? " email" : ""}`}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
