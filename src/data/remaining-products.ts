import underslung from '@/data/generated/underslung-cranes.json';
import goliath from '@/data/generated/goliath-semi-goliath-crane.json';
import jib from '@/data/generated/jib-crane.json';
import monorail from '@/data/generated/monorail-crane.json';

const fromSource = (source: typeof underslung) => ({ title: source.headings[7], breadcrumb: source.headings[6], description: source.paragraphs.slice(2, 6), gallery: source.images.slice(3, 6), brochure: source.pdfs[0], specificationTables: source.tables, standardFeatures: source.featureLists.flat() } as const);

export const remainingProducts = {
  'underslung-cranes': fromSource(underslung),
  'goliath-semi-goliath-crane': fromSource(goliath),
  'jib-crane': fromSource(jib),
  'monorail-crane': fromSource(monorail),
} as const;
