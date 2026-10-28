import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';

type Props = { file: string; eyebrow: string; title: string };

export default async function LegacyContentPage({ file, eyebrow, title }: Props) {
  const source = await readFile(path.join(process.cwd(), 'public', file), 'utf8');
  const content = source.match(/<!--End breadcrumb area-->([\s\S]*?)<!--Start footer area-->/)?.[1] ?? '';
  return <main><link rel="stylesheet" href="/assets/css/module-css/contact-page.css"/><SiteHeader/><PageHero eyebrow={eyebrow} title={title}/><div dangerouslySetInnerHTML={{__html:content}}/><SiteFooter/></main>;
}
