import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';

export default async function ServicesPage() {
  const source = await readFile(path.join(process.cwd(), 'public', 'services.html'), 'utf8');
  const content = source.match(/<!--Start Service Details Area-->([\s\S]*?)<!--Start Faq Style1 Area-->/)?.[1] ?? '';
  return <main><link rel="stylesheet" href="/assets/css/module-css/services-section.css"/><link rel="stylesheet" href="/assets/css/module-css/breadcrumb-section.css"/><SiteHeader/><PageHero eyebrow="Services" title="Crane Spare Parts Maintenance Services in India"/><div dangerouslySetInnerHTML={{__html:content}}/><SiteFooter/></main>;
}
