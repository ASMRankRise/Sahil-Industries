import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHero } from '@/components/PageHero';
import { LegacyMotionRegion } from '@/components/LegacyMotionRegion';
import { LegacyRuntime } from '@/components/LegacyRuntime';

type Props = { file: string; eyebrow: string; title: string; captcha?: boolean };

export default async function LegacyContentPage({ file, eyebrow, title, captcha = false }: Props) {
  const source = await readFile(path.join(process.cwd(), 'public', file), 'utf8');
  const content = source.match(/<!--End breadcrumb area-->([\s\S]*?)<!--Start footer area-->/)?.[1] ?? '';
  return <main>
    <link rel="stylesheet" href="/assets/css/module-css/contact-page.css" />
    <link rel="stylesheet" href="/assets/css/module-css/services-section.css" />
    <link rel="stylesheet" href="/assets/css/fancybox.min.css" />
    <SiteHeader />
    <PageHero eyebrow={eyebrow} title={title} />
    <LegacyMotionRegion html={content} />
    <SiteFooter />
    <LegacyRuntime captcha={captcha} />
  </main>;
}
