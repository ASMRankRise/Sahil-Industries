import source from '@/data/generated/electric-wire-rope-hoist.json';

export const electricWireRopeHoistProduct = {
  title: source.headings[7],
  breadcrumb: source.headings[6],
  description: source.paragraphs.slice(2, 4),
  gallery: source.images.slice(3, 5),
  brochure: source.pdfs[0],
  specificationTables: source.tables,
  standardFeatures: source.featureLists.flat(),
} as const;
