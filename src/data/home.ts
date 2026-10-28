export type ImageContent = { image: string; title: string };

export const homeProducts: ImageContent[] = [
  { image: 'single-girder-eot-crane.jpg', title: 'Single Girder EOT Crane' },
  { image: 'double-girder-eot-crane.jpg', title: 'Double Girder EOT Crane' },
  { image: 'electric-wire-rope-hoist.jpg', title: 'Electric Wire Rope Hoist' },
  { image: 'underslung-cranes.jpg', title: 'Underslung Cranes' },
  { image: 'goliath-gantry-crane.jpg', title: 'Goliath / Semi Goliath Crane' },
  { image: 'jib-crane.jpg', title: 'JIB Crane' },
  { image: 'monorail-crane.jpg', title: 'Monorail Crane' },
];

export const industries: ImageContent[] = [
  { image: 'electrical.jpg', title: 'Electrical' }, { image: 'heavy-engineering.jpg', title: 'Heavy Engineering' },
  { image: 'manufacturing.jpg', title: 'Manufacturing' }, { image: 'nuclear-power-plant.jpg', title: 'Nuclear Power Plants' },
  { image: 'oil-and-gas.jpg', title: 'Oil and Gas' }, { image: 'pre-cast-manufacturing.jpg', title: 'Precast Manufacturing' },
  { image: 'steel-metal.jpg', title: 'Steel and Metal' }, { image: 'infrastructure.jpg', title: 'Infrastructure' },
  { image: 'tunnel-shaft-making.jpg', title: 'Tunnel / Shaft Making' }, { image: 'ware-house.jpg', title: 'Warehousing' },
  { image: 'forging-industry.jpg', title: 'Forging Industry' }, { image: 'foundry.jpg', title: 'Foundry' },
  { image: 'government-project.jpg', title: 'Government Projects' }, { image: 'sugar-factory.jpg', title: 'Sugar Factory' },
  { image: 'windmill-project.jpg', title: 'Wind Mill Project' }, { image: 'textile-industry.jpg', title: 'Textile Industry' },
  { image: 'cement-pipe-industry.jpg', title: 'Cement Pipe Industry' },
];

export const clientLogos = ['01-ghatage-patil-industries.jpg', 'wilo.jpg', '02-kirloskar-brothers.jpg', '03-menon-and-menon-ltd.jpg', '04-sound-casting-pvt-ltd.jpg', '05-fie-spherotech.jpg', '06-caspro-metal-industries.jpg', '07-sameer-casting.jpg', '08-metallurgy-collaboration.jpg', '09-altech.jpg', '10-tulip-casting.jpg', '11-ramkrishna-foundry.jpg'] as const;
