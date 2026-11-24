import type { Metadata } from "next";
import ProductsCatalogPage from "@/components/ProductsCatalogPage";

export const metadata: Metadata = {
  title: "Industrial Cranes & Wire Rope Hoists | Sahil Industries",
  description:
    "Explore Sahil Industries' complete portfolio of Single Girder, Double Girder EOT Cranes, Electric Wire Rope Hoists, Goliath Gantry Cranes, and JIB Cranes manufactured to IS 3177 and IS 807 standards.",
};

export default function Page() {
  return <ProductsCatalogPage />;
}
