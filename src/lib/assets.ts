// Maps stored image_url paths (e.g. "/src/assets/cones-brown.jpg") to bundled imports.
import logo from "@/assets/mahrina-logo.png";
import packMixed from "@/assets/product-pack-mixed.jpg";
import conesLineup from "@/assets/cones-lineup.jpg";
import conesGreen from "@/assets/cones-green.jpg";
import conesBrown from "@/assets/cones-brown.jpg";
import conesOlive from "@/assets/cones-olive.jpg";
import heroFlatlay from "@/assets/hero-flatlay.jpg";
import design1 from "@/assets/mehendi-design-1.jpg";
import design2 from "@/assets/mehendi-design-2.jpg";
import design3 from "@/assets/mehendi-design-3.jpg";
import design4 from "@/assets/mehendi-design-4.jpg";
import design5 from "@/assets/mehendi-design-5.jpg";
import design6 from "@/assets/mehendi-design-6.jpg";

export const LOGO = logo;

export const DESIGN_GALLERY = [design1, design2, design3, design4, design5, design6];

const MAP: Record<string, string> = {
  "/src/assets/mahrina-logo.png": logo,
  "/src/assets/product-pack-mixed.jpg": packMixed,
  "/src/assets/cones-lineup.jpg": conesLineup,
  "/src/assets/cones-green.jpg": conesGreen,
  "/src/assets/cones-brown.jpg": conesBrown,
  "/src/assets/cones-olive.jpg": conesOlive,
  "/src/assets/hero-flatlay.jpg": heroFlatlay,
};

export function resolveImage(url?: string | null): string {
  if (!url) return packMixed;
  if (MAP[url]) return MAP[url];
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return packMixed;
}

export const PRESET_IMAGES = Object.keys(MAP);
