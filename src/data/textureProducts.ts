export type BundleCount = 1 | 2 | 3;
export type BundleOption = "oneBundle" | "twoBundles" | "threeBundles";

export type PricingItem = {
  length: string;
  oneBundle: number;
  twoBundles: number;
  threeBundles: number;
};

export type TextureProduct = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  features: string[];
};

export const bundleLabels: Record<BundleOption, string> = {
  oneBundle: "1 Bundle",
  twoBundles: "2 Bundle Deal",
  threeBundles: "3 Bundle Deal",
};

export const bundleCounts: Record<BundleOption, BundleCount> = {
  oneBundle: 1,
  twoBundles: 2,
  threeBundles: 3,
};

export const pricing: PricingItem[] = [
  { length: '12"', oneBundle: 100, twoBundles: 195, threeBundles: 285 },
  { length: '14"', oneBundle: 110, twoBundles: 215, threeBundles: 315 },
  { length: '16"', oneBundle: 120, twoBundles: 235, threeBundles: 345 },
  { length: '18"', oneBundle: 135, twoBundles: 265, threeBundles: 390 },
  { length: '20"', oneBundle: 150, twoBundles: 295, threeBundles: 435 },
  { length: '22"', oneBundle: 165, twoBundles: 325, threeBundles: 480 },
  { length: '24"', oneBundle: 185, twoBundles: 365, threeBundles: 540 },
  { length: '26"', oneBundle: 205, twoBundles: 405, threeBundles: 600 },
  { length: '28"', oneBundle: 225, twoBundles: 445, threeBundles: 660 },
  { length: '30"', oneBundle: 250, twoBundles: 495, threeBundles: 735 },
];

export const bundleOptions: BundleOption[] = [
  "oneBundle",
  "twoBundles",
  "threeBundles",
];

export const textureProducts: TextureProduct[] = [
  {
    slug: "kinky-straight",
    name: "Kinky Straight",
    shortDescription: "Premium raw hair with a soft, blown-out texture.",
    description:
      "Premium raw hair with a soft, blown-out texture, natural volume, and a seamless blend with pressed or naturally textured hair.",
    images: [
      "/textures/kinky-straight/main.png",
      "/textures/kinky-straight/detail-1.png",
      "/textures/kinky-straight/model.png",
    ],
    rating: 4.9,
    reviewCount: 128,
    features: [
      "Textured, blown-out appearance",
      "Natural volume",
      "Blends well with pressed or naturally textured hair",
    ],
  },
  {
    slug: "natural-wavy",
    name: "Natural Wavy",
    shortDescription: "Premium raw hair with soft natural waves.",
    description:
      "Premium raw hair with soft natural waves, lightweight movement, and versatile styling options.",
    images: [
      "/textures/natural-wavy/main.png",
      "/textures/natural-wavy/detail-1.png",
      "/textures/natural-wavy/model.png",
    ],
    rating: 4.8,
    reviewCount: 96,
    features: [
      "Soft natural waves",
      "Lightweight movement",
      "Styles well for relaxed waves or a polished finish",
    ],
  },
  {
    slug: "burmese-curly",
    name: "Burmese Curly",
    shortDescription: "Premium raw hair with defined curls.",
    description:
      "Premium raw hair with defined curls, full volume, and a soft luxurious finish.",
    images: [
      "/textures/burmese-curly/main.png",
      "/textures/burmese-curly/detail-1.png",
      "/textures/burmese-curly/model.png",
    ],
    rating: 4.9,
    reviewCount: 112,
    features: [
      "Defined curls",
      "Full volume",
      "Designed for a soft, luxurious curly installation",
    ],
  },
];

export function getTextureProduct(slug: string) {
  return textureProducts.find((product) => product.slug === slug);
}

export function getSelectedPrice(
  selectedLength: string,
  selectedBundle: BundleOption,
) {
  const selectedPricing = pricing.find(
    (item) => item.length === selectedLength,
  );

  if (!selectedPricing) {
    return pricing[0].oneBundle;
  }

  return selectedPricing[selectedBundle];
}

export function getPackagePrice(length: string, bundleCount: BundleCount) {
  const pricingItem = pricing.find((item) => item.length === length);

  if (!pricingItem) {
    return pricing[0].oneBundle;
  }

  switch (bundleCount) {
    case 1:
      return pricingItem.oneBundle;
    case 2:
      return pricingItem.twoBundles;
    case 3:
      return pricingItem.threeBundles;
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function createVariantId(
  textureSlug: string,
  length: string,
  bundleOption: BundleOption,
) {
  const lengthValue = length.replace(/[^0-9]/g, "");

  return `${textureSlug}-${lengthValue}-${bundleOption}`;
}
