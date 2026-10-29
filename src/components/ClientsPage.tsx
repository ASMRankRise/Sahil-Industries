import { ModernPageShell } from '@/components/ModernPageShell';
import { Reveal } from '@/components/ui/Reveal';
import { clients } from '@/data/clients';

export default function ClientsPage() { return <ModernPageShell eyebrow="Trusted partnerships" title="Our Esteemed Clients"><section className="modern-section modern-clients"><div className="modern-container"><div className="modern-heading"><p className="modern-eyebrow"><span />Industry partnerships</p><h2>Trusted by manufacturers who move India forward.</h2></div><div className="modern-client-grid">{clients.map(([image, name], index) => <Reveal key={image} delay={(index % 6) * .04}><div><img src={`/sahilcrane/customers/${image}`} alt={name} /></div></Reveal>)}</div></div></section></ModernPageShell>; }
