import source from '@/data/generated/double-girder-eot-crane.json';

/** Source-derived Double Girder content, including all original specification tables. */
export const doubleGirderProduct = {
  title: source.headings[7],
  breadcrumb: source.headings[6],
  description: source.paragraphs.slice(2, 5),
  gallery: source.images.slice(3, 6),
  brochure: source.pdfs[0],
  specificationTables: source.tables,
  standardFeatures: source.featureLists.flat(),
} as const;
