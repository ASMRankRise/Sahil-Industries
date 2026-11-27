import underslung from "@/data/generated/underslung-cranes.json";
import goliath from "@/data/generated/goliath-semi-goliath-crane.json";
import jib from "@/data/generated/jib-crane.json";
import monorail from "@/data/generated/monorail-crane.json";

const fromSource = (source: typeof underslung) =>
  ({
    title: source.headings[7],
    breadcrumb: source.headings[6],
    description: source.paragraphs.slice(2, 6),
    gallery: source.images.slice(3, 6),
    brochure: source.pdfs[0],
    specificationTables: source.tables,
    standardFeatures: source.featureLists.flat(),
  }) as const;

export const remainingProducts = {
  "underslung-cranes": {
    ...fromSource(underslung),
    title: "Underslung Cranes Manufacturer in India",
    breadcrumb: "Underslung Cranes",
  },
  "goliath-semi-goliath-crane": {
    ...fromSource(goliath),
    title: "Golianth / Semi Golianth Cranes Manufacturer in India",
    breadcrumb: "Goliath / Semi Goliath Crane",
  },
  "jib-crane": {
    ...fromSource(jib),
    title: "JIB Crane Manufacturer in India",
    breadcrumb: "JIB Crane",
    applicationTypes: [
      {
        title: "Wall Mounting Type",
        description:
          "Wall or column mounted Jib Cranes are best suited for applications where swivel motion is required for execution of work. These cranes are mounted on steel columns and provide swivel motion of up to 170 degrees. Special designs are also available for mounting the Jib crane on RCC columns.",
      },
      {
        title: "Free Standing Type",
        description:
          "Pillar mounted (free standing) Jib Cranes are best suited for applications where there is no suitable beam or RCC support for carrying the crane load. They can be installed both indoors and outdoors.",
      },
    ],
  },
  "monorail-crane": {
    ...fromSource(monorail),
    title: "Monorail Crane Manufacturer in India",
    breadcrumb: "Monorail Crane",
    description: fromSource(monorail).description.filter(
      (paragraph) =>
        !paragraph.startsWith("Tuesday - Sunday") &&
        !paragraph.startsWith("Monday - Closed"),
    ),
  },
} as const;
