import { Reveal } from '@/components/ui/Reveal';

type PageHeroProps = { eyebrow: string; title: string; image?: string };

export function PageHero({ eyebrow, title, image = '/sahilcrane/about/about-img.jpg' }: PageHeroProps) {
  return <section className="page-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(4,28,48,.72),rgba(4,28,48,.3)),url('${image}')` }}><div className="wrap"><Reveal><p>{eyebrow}</p><h1>{title}</h1></Reveal></div></section>;
}
