import source from '@/data/generated/single-girder-eot-crane.json';

export const singleGirderProduct = {
  title: source.headings[6],
  breadcrumb: source.headings[5],
  description: source.paragraphs.slice(2, 5),
  gallery: source.images.slice(3, 6),
  brochure: source.pdfs[0],
  specificationTables: source.tables,
  standardFeatures: [
    'Standard Single Speed Motors', 'Two Speed option available through variable frequence drives, Micro motor and two speed motors', 'Compact Hoist design, giving minimum hook approaches', 'Quality Test certificates for hoist test, wire rope, hook forgings etc.', 'Electromagnetic break for hoisting motion', 'Option of centrifugal mechanical/ AC or DC electromagnetic break for Cross and long travel motions.', "Welded box type beam or standard rolled 'I' beam construction for main bridge girder", 'Standard Supply voltage 415V, 50 Hz', 'Standard Control Voltage 110V', 'Optional Control Voltages 24V/48V', 'Standard Cross travel speed 15 mpm', 'Standard Long travel speed 20 mpm', 'Other speed available upon request', 'Tables indicate Cranes designed as per Class Il as per IS 3177and IS 807', 'Cranes can also be designed for other Classifications', 'Compact long and cross travel drives', 'Limit switches for all motions', 'Emergency upper limit switch for hoisting motion', 'Low headroom hoist option', 'Underslung cranes can also be supplied where there is constraint of space', 'Crane component kits can also be supplied',
  ],
  optionalFeatures: ['Anti-collision arrangement for two or more cranes working in the same bay', 'Independent moving pendent', 'Load indicator', 'Radio remote Control', 'Alarm', 'Bridge lights'],
} as const;
