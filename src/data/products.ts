export type ProductSource = {
  slug: string;
  sourceFile: string;
  title: string;
  pageTitle: string;
  cardImage: string;
  brochure?: string;
};

export type CatalogProduct = ProductSource & {
  category: "EOT Cranes" | "Gantry Cranes" | "Hoists" | "Workstation Cranes";
  capacity: string;
  tagline: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
};

/** Route and asset inventory copied from the original product pages. */
export const products: ProductSource[] = [
  {
    slug: "single-girder-eot-crane",
    sourceFile: "products/single-girder-eot-crane.html",
    title: "Single Girder EOT Crane",
    pageTitle: "Single Girder EOT Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/single-girder-eot-crane.jpg",
    brochure: "/sahilcrane/broucher/girder-eot-crane.pdf",
  },
  {
    slug: "double-girder-eot-crane",
    sourceFile: "products/double-girder-eot-crane.html",
    title: "Double Girder EOT Crane",
    pageTitle: "Double Girder EOT Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/double-girder-eot-crane.jpg",
    brochure: "/sahilcrane/broucher/girder-eot-crane.pdf",
  },
  {
    slug: "electric-wire-rope-hoist",
    sourceFile: "products/electric-wire-rope-hoist.html",
    title: "Electric Wire Rope Hoist",
    pageTitle: "Electric Wire Rope Hoist Manufacturer in India",
    cardImage: "/sahilcrane/products/electric-wire-rope-hoist.jpg",
    brochure: "/sahilcrane/broucher/electric-wire-rope-hoist.pdf",
  },
  {
    slug: "underslung-cranes",
    sourceFile: "products/underslung-cranes.html",
    title: "Underslung Cranes",
    pageTitle: "Underslung Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/underslung-cranes.jpg",
  },
  {
    slug: "goliath-semi-goliath-crane",
    sourceFile: "products/goliath-semi-goliath-crane.html",
    title: "Goliath / Semi Goliath Crane",
    pageTitle: "Golianth / Semi Golianth Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/goliath-gantry-crane.jpg",
  },
  {
    slug: "jib-crane",
    sourceFile: "products/jib-crane.html",
    title: "JIB Crane",
    pageTitle: "JIB Crane Manufacturer in India",
    cardImage: "/sahilcrane/products/jib-crane.jpg",
  },
  {
    slug: "monorail-crane",
    sourceFile: "products/monorail-crane.html",
    title: "Monorail Crane",
    pageTitle: "Monorail Crane Manufacturer in India",
    cardImage: "/sahilcrane/products/monorail-crane.jpg",
  },
];

export const catalogProducts: CatalogProduct[] = [
  {
    slug: "single-girder-eot-crane",
    sourceFile: "products/single-girder-eot-crane.html",
    title: "Single Girder EOT Crane",
    pageTitle: "Single Girder EOT Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/single-girder-eot-crane.jpg",
    brochure: "/sahilcrane/broucher/girder-eot-crane.pdf",
    category: "EOT Cranes",
    capacity: "1 Ton – 20 Tons",
    tagline: "Cost-Effective Workshop Material Handling",
    description:
      "Engineered for light to medium-duty fabrication, machine shops, and warehouses. Features compact hoist design with minimum hook approaches to maximize effective floor coverage.",
    highlights: [
      "Welded box girder or rolled I-beam construction",
      "IS 3177 & IS 807 design standards compliance",
      "Optional micro-speed VFD control for fine positioning",
      "Integrated emergency limit switches & fail-safe brakes",
    ],
    specs: [
      { label: "Capacity", value: "Up to 20 Tonnes" },
      { label: "Span Range", value: "Up to 30 Meters" },
      { label: "Duty Class", value: "Class II (IS 3177)" },
      { label: "Travel Speeds", value: "Cross: 15 mpm / Long: 20 mpm" },
    ],
  },
  {
    slug: "double-girder-eot-crane",
    sourceFile: "products/double-girder-eot-crane.html",
    title: "Double Girder EOT Crane",
    pageTitle: "Double Girder EOT Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/double-girder-eot-crane.jpg",
    brochure: "/sahilcrane/broucher/girder-eot-crane.pdf",
    category: "EOT Cranes",
    capacity: "5 Tons – 200 Tons",
    tagline: "Heavy Duty & High Hook Lift Solutions",
    description:
      "Rugged heavy-duty overhead crane built for high duty cycles in steel plants, foundries, power generation, and heavy engineering facilities with maximized lift height.",
    highlights: [
      "Heavy open winch or crab hoist configuration",
      "Full-length maintenance walkway & handrails",
      "Radio remote control & ergonomic driver cabin options",
      "Forged alloy steel wheels with hardened rail profiles",
    ],
    specs: [
      { label: "Capacity", value: "Up to 200 Tonnes" },
      { label: "Span Range", value: "Up to 45 Meters" },
      { label: "Duty Class", value: "Class II, III & IV" },
      { label: "Hook Lift", value: "High-bay maximum clearance" },
    ],
  },
  {
    slug: "electric-wire-rope-hoist",
    sourceFile: "products/electric-wire-rope-hoist.html",
    title: "Electric Wire Rope Hoist",
    pageTitle: "Electric Wire Rope Hoist Manufacturer in India",
    cardImage: "/sahilcrane/products/electric-wire-rope-hoist.jpg",
    brochure: "/sahilcrane/broucher/electric-wire-rope-hoist.pdf",
    category: "Hoists",
    capacity: "0.5 Ton – 50 Tons",
    tagline: "Precision Engineered Modular Hoisting",
    description:
      "Compact modular electric wire rope hoists with case-hardened alloy gearboxes, precision-grooved rope drums, and fail-safe electromagnetic disc/shoe brakes.",
    highlights: [
      "Modular design for simplified maintenance access",
      "Fail-safe AC/DC electromagnetic disc brakes",
      "Hardened precision gears with grease bath lubrication",
      "Upper & lower limit switches with overload cut-off",
    ],
    specs: [
      { label: "Capacity", value: "0.5T to 50 Tonnes" },
      { label: "Lift Height", value: "Up to 50 Meters" },
      { label: "Standard", value: "IS 3938 Specification" },
      { label: "Control", value: "110V / 24V Safe Pendant" },
    ],
  },
  {
    slug: "underslung-cranes",
    sourceFile: "products/underslung-cranes.html",
    title: "Underslung Cranes",
    pageTitle: "Underslung Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/underslung-cranes.jpg",
    brochure: "/sahilcrane/broucher/girder-eot-crane.pdf",
    category: "Workstation Cranes",
    capacity: "0.5 Ton – 10 Tons",
    tagline: "Zero Floor Obstruction Overhead Solution",
    description:
      "Suspended directly from existing roof trusses without requiring dedicated ground support columns, giving completely unobstructed floor workspace for assembly lines.",
    highlights: [
      "Suspended from roof truss structure (no columns needed)",
      "Maximized floor area utilization and worker mobility",
      "Ideal for lower headroom bays & light pre-engineered buildings",
      "Cantilever overhang options to reach side machinery",
    ],
    specs: [
      { label: "Capacity", value: "Up to 10 Tonnes" },
      { label: "Span Range", value: "Up to 24 Meters" },
      { label: "Suspension", value: "Ceiling-hung runway" },
      { label: "Footprint", value: "100% Floor clear" },
    ],
  },
  {
    slug: "goliath-semi-goliath-crane",
    sourceFile: "products/goliath-semi-goliath-crane.html",
    title: "Goliath / Semi Goliath Crane",
    pageTitle: "Golianth / Semi Golianth Cranes Manufacturer in India",
    cardImage: "/sahilcrane/products/goliath-gantry-crane.jpg",
    category: "Gantry Cranes",
    capacity: "5 Tons – 100 Tons",
    tagline: "Outdoor Yards, Stockyards & Shipyards",
    description:
      "Self-supported rail-mounted gantry cranes built for unroofed outdoor applications including steel stockyards, railway sidings, pre-cast concrete yards, and docks.",
    highlights: [
      "No building or runway pillar structure required",
      "Full IP55/IP65 outdoor weather & motor protection hoods",
      "Storm anchor clamps & heavy rail sweeping plates",
      "Semi-goliath configuration available for bay-side rails",
    ],
    specs: [
      { label: "Capacity", value: "Up to 100 Tonnes" },
      { label: "Span Range", value: "Up to 35 Meters" },
      { label: "Application", value: "Open yard & Outdoor" },
      { label: "Safety", value: "Storm brakes & Rail locks" },
    ],
  },
  {
    slug: "jib-crane",
    sourceFile: "products/jib-crane.html",
    title: "JIB Crane",
    pageTitle: "JIB Crane Manufacturer in India",
    cardImage: "/sahilcrane/products/jib-crane.jpg",
    category: "Workstation Cranes",
    capacity: "0.5 Ton – 10 Tons",
    tagline: "Dedicated 360° Workstation Handling",
    description:
      "Versatile localized lifting solution designed for dedicated workstations, CNC machine tool loading, and fabrication cells with up to 360° continuous rotation.",
    highlights: [
      "Pillar-mounted (free-standing) with up to 360° slew",
      "Wall/column-mounted option with 180° radius coverage",
      "Manual push-pull or motorized electric slew drive",
      "Minimal foundation footprint with rigid tubular pillar",
    ],
    specs: [
      { label: "Capacity", value: "0.5T to 10 Tonnes" },
      { label: "Rotation", value: "180° (Wall) / 360° (Pillar)" },
      { label: "Arm Reach", value: "Up to 8 Meters" },
      { label: "Mounting", value: "Pillar / RCC Column / Wall" },
    ],
  },
  {
    slug: "monorail-crane",
    sourceFile: "products/monorail-crane.html",
    title: "Monorail Crane",
    pageTitle: "Monorail Crane Manufacturer in India",
    cardImage: "/sahilcrane/products/monorail-crane.jpg",
    category: "Workstation Cranes",
    capacity: "0.5 Ton – 10 Tons",
    tagline: "Linear & Curved Assembly Line Transit",
    description:
      "Flexible linear conveying and material handling systems tailored to follow intricate production paths, paint booths, dipping tanks, and multi-station warehouses.",
    highlights: [
      "Custom straight, curved, and branching track layouts",
      "Integrated with high-efficiency electric trolley hoists",
      "Continuous material flow through processing lines",
      "Energy efficient with minimal structural footprint",
    ],
    specs: [
      { label: "Capacity", value: "Up to 10 Tonnes" },
      { label: "Track Routing", value: "Straight, Curved & Switched" },
      { label: "Trolley", value: "Articulated motorized drive" },
      { label: "Use Case", value: "Dipping / Paint / Assembly" },
    ],
  },
];

export const productBySlug = Object.fromEntries(
  products.map((product) => [product.slug, product]),
);
