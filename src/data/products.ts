export type ProductSource = {
  slug: string;
  sourceFile: string;
  title: string;
  pageTitle: string;
  cardImage: string;
  brochure?: string;
};

/** Route and asset inventory copied from the original product pages. */
export const products: ProductSource[] = [
  { slug: 'single-girder-eot-crane', sourceFile: 'products/single-girder-eot-crane.html', title: 'Single Girder EOT Crane', pageTitle: 'Single Girder EOT Cranes Manufacturer in India', cardImage: '/sahilcrane/products/single-girder-eot-crane.jpg', brochure: '/sahilcrane/broucher/girder-eot-crane.pdf' },
  { slug: 'double-girder-eot-crane', sourceFile: 'products/double-girder-eot-crane.html', title: 'Double Girder EOT Crane', pageTitle: 'Double Girder EOT Cranes Manufacturer in India', cardImage: '/sahilcrane/products/double-girder-eot-crane.jpg', brochure: '/sahilcrane/broucher/girder-eot-crane.pdf' },
  { slug: 'electric-wire-rope-hoist', sourceFile: 'products/electric-wire-rope-hoist.html', title: 'Electric Wire Rope Hoist', pageTitle: 'Electric Wire Rope Hoist Manufacturer in India', cardImage: '/sahilcrane/products/electric-wire-rope-hoist.jpg', brochure: '/sahilcrane/broucher/electric-wire-rope-hoist.pdf' },
  { slug: 'underslung-cranes', sourceFile: 'products/underslung-cranes.html', title: 'Underslung Cranes', pageTitle: 'Underslung Cranes Manufacturer in India', cardImage: '/sahilcrane/products/underslung-cranes.jpg' },
  { slug: 'goliath-semi-goliath-crane', sourceFile: 'products/goliath-semi-goliath-crane.html', title: 'Goliath / Semi Goliath Crane', pageTitle: 'Golianth / Semi Golianth Cranes Manufacturer in India', cardImage: '/sahilcrane/products/goliath-gantry-crane.jpg' },
  { slug: 'jib-crane', sourceFile: 'products/jib-crane.html', title: 'JIB Crane', pageTitle: 'JIB Crane Manufacturer in India', cardImage: '/sahilcrane/products/jib-crane.jpg' },
  { slug: 'monorail-crane', sourceFile: 'products/monorail-crane.html', title: 'Monorail Crane', pageTitle: 'Monorail Crane Manufacturer in India', cardImage: '/sahilcrane/products/monorail-crane.jpg' },
];

export const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product]));
