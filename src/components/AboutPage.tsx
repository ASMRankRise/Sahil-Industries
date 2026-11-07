import { ModernPageShell } from '@/components/ModernPageShell';
import { Reveal } from '@/components/ui/Reveal';
import { reasonsToChoose } from '@/data/about';
import { Award, CheckCircle, Cog, Headphones, Lightbulb, Shield, SlidersHorizontal, Users } from 'lucide-react';
import { WhyChooseTimeline } from '@/components/WhyChooseTimeline';

const asset = (path: string) => `/sahilcrane/${path}`;
const hexPositions = Array(8).fill('col-span-1') as string[];
const reasonIcons = [Shield, Cog, SlidersHorizontal, Lightbulb, Headphones, Users, CheckCircle, Award];

export default function AboutPage() {
  return <ModernPageShell eyebrow="About Sahil Industries" title="Hoist EOT Cranes Manufacturer in India"><section className="py-28 max-md:py-20"><div className="mx-auto grid w-[min(1240px,calc(100%-64px))] grid-cols-[minmax(320px,.88fr)_minmax(340px,1fr)] items-center gap-[clamp(50px,9vw,150px)] max-md:w-[calc(100%-36px)] max-md:grid-cols-1"><Reveal><div><p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"><span />Our foundation</p><h2 className="mb-6 text-[clamp(34px,4vw,54px)] font-bold leading-[1.06] tracking-[-.05em]">Engineering trust into every lift.</h2><p>Sahil Industries has it&apos;s manufacturing unit in Kolhapur&apos;s prestigious industrial area, five star MIDC, Kagal.</p><p>Our pre-engineered cranes are manufactured as per the IS guidelines and taking into considerations the particular need of our client. We are proud to see our cranes being established globally and internationally, handling a wide variety of materials. Our range of industrial cranes &amp; components is available with lifting capacity of up to 200 tons and includes wire rope hoist or open winch design, as well as Explosion proof cranes, and a variety of crane components.</p><p>Similarly we have more than 100 clients to whom we have designed and provided solutions as per their unique needs, like repairing, maintenance and servicing support. We provide these solutions not only to the products we have manufactured, but any other product of any make, that our client has.</p></div></Reveal><Reveal delay={.12}><div className="relative pb-[38px] pr-[38px]"><img src={asset('about/sahilcrane-img.jpg')} alt="Sahil Industries facility" /></div></Reveal></div></section><section className="bg-ink py-28 text-slate-300 max-md:py-20"><div className="mx-auto grid w-[min(1240px,calc(100%-64px))] grid-cols-[330px_1fr] items-center gap-[clamp(48px,8vw,130px)] max-md:w-[calc(100%-36px)] max-md:grid-cols-1"><Reveal><img src={asset('about/abhijit-patil.jpg')} alt="Satyajeet Patil and Abhijeet Patil" /></Reveal><Reveal delay={.12}><div><p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.15em] text-safety"><span />Satyajeet Patil and Mr Abhijeet Patil</p><h2>About Director</h2><p>Satyajeet Patil and Mr Abhijeet Patil is a young, enthusiastic and ambitious entrepreneur, whose goal in business is to provide the best manufactured goods from their unit. Customer and his needs always come first for Mr Abhijeet and that&apos;s why his designs and solutions are always customer centric.</p><p>If he is not working, which is very rare, he can be seen taking absolutely amazing photographs or reading a book.</p></div></Reveal></div></section><WhyChooseTimeline /></ModernPageShell>;
}


















