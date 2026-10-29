import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceDirectory = path.join(process.cwd(), 'public', 'products');
const outputDirectory = path.join(process.cwd(), 'src', 'data', 'generated');
const files = ['single-girder-eot-crane', 'double-girder-eot-crane', 'electric-wire-rope-hoist', 'underslung-cranes', 'goliath-semi-goliath-crane', 'jib-crane', 'monorail-crane'];
const text = (value) => value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const matches = (html, expression) => [...html.matchAll(expression)].map((match) => match[1]);

await mkdir(outputDirectory, { recursive: true });
for (const slug of files) {
  const html = await readFile(path.join(sourceDirectory, `${slug}.html`), 'utf8');
  const tables = matches(html, /<table[^>]*>([\s\S]*?)<\/table>/gi).map((table) => matches(table, /<tr[^>]*>([\s\S]*?)<\/tr>/gi).map((row) => [...row.matchAll(/<(th|td)([^>]*)>([\s\S]*?)<\/(?:th|td)>/gi)].map((cell) => ({ type: cell[1], colSpan: Number(cell[2].match(/colspan=["']?(\d+)/i)?.[1] ?? 1), rowSpan: Number(cell[2].match(/rowspan=["']?(\d+)/i)?.[1] ?? 1), value: text(cell[3]) }))));
  const content = {
    slug,
    headings: matches(html, /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi).map(text),
    paragraphs: matches(html, /<p[^>]*>([\s\S]*?)<\/p>/gi).map(text).filter(Boolean),
    images: matches(html, /<img[^>]+src=["']([^"']+)["'][^>]*>/gi),
    pdfs: matches(html, /href=["']([^"']+\.pdf)["']/gi),
    featureLists: matches(html, /<ul[^>]*class=["'][^"']*pt-0[^"']*["'][^>]*>([\s\S]*?)<\/ul>/gi).map((list) => matches(list, /<li[^>]*>([\s\S]*?)<\/li>/gi).map(text)),
    tables,
  };
  await writeFile(path.join(outputDirectory, `${slug}.json`), `${JSON.stringify(content, null, 2)}\n`);
}
