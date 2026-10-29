import { Reveal } from '@/components/ui/Reveal';

type PageHeroProps = { eyebrow: string; title: string; image?: string };

export function PageHero({ eyebrow, title, image = '/sahilcrane/about/about-img.jpg' }: PageHeroProps) {
  return <section className="relative isolate flex min-h-[390px] items-center overflow-hidden bg-cover bg-center text-white before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-ink/95 before:to-ink/45" style={{ backgroundImage: `url('${image}')` }}><div className="mx-auto w-[min(1240px,calc(100%-64px))] max-sm:w-[calc(100%-36px)]"><Reveal><p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety">{eyebrow}</p><h1 className="max-w-4xl text-[clamp(42px,5vw,68px)] font-bold leading-[1.04] tracking-[-.055em]">{title}</h1></Reveal></div></section>;
}
