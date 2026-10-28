import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';

export default async function ClientsPage() {
  const source = await readFile(path.join(process.cwd(), 'public', 'clients.html'), 'utf8');
  const content = source.match(/<section class="service-style2-area">([\s\S]*?)<\/section>/)?.[0] ?? '';
  return <main><link rel="stylesheet" href="/assets/css/module-css/services-section.css"/><SiteHeader/><PageHero eyebrow="Clients" title="Clients"/><div dangerouslySetInnerHTML={{__html:content}}/><SiteFooter/></main>;
}
