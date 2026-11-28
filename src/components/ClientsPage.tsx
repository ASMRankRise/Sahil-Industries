import Image from "next/image";
import { ModernPageShell } from "@/components/ModernPageShell";
import { clients } from "@/data/clients";

export default function ClientsPage() {
  return (
    <ModernPageShell
      eyebrow="Trusted partnerships"
      title="Our Esteemed Clients">
      <section className="bg-mist py-20 max-md:py-14">
        <div className="mx-auto w-[min(1240px,calc(100%-64px))] max-md:w-[calc(100%-36px)]">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">
              <span className="h-0.5 w-8 bg-safety" />
              Industry partnerships
            </p>
            <h2 className="text-[clamp(34px,4vw,55px)] font-bold leading-[1.05] tracking-[-.052em]">
              Trusted by manufacturers who move India forward.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {clients.map(([image, name]) => (
              <div
                key={image}
                className="flex h-[120px] items-center justify-center rounded-xl border border-ink/10 bg-white p-5 shadow-sm max-md:h-[92px] max-md:p-3">
                <Image
                  className="h-auto max-h-[65px] w-auto max-w-full object-contain grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100"
                  src={`/sahilcrane/customers/${image}`}
                  alt={name}
                  width={160}
                  height={65}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </ModernPageShell>
  );
}
