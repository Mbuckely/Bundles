import { notFound } from "next/navigation";
import { TexturePurchasePage } from "@/components/textures/TexturePurchasePage";
import {
  getTextureProduct,
  textureProducts,
} from "@/data/textureProducts";

type TexturePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return textureProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: TexturePageProps) {
  const { slug } = await params;
  const product = getTextureProduct(slug);

  if (!product) {
    return {
      title: "Texture Not Found | RRLUX Extensions",
    };
  }

  return {
    title: `${product.name} | RRLUX Extensions`,
    description: product.shortDescription,
  };
}

export default async function TexturePage({ params }: TexturePageProps) {
  const { slug } = await params;
  const product = getTextureProduct(slug);

  if (!product) {
    notFound();
  }

  return <TexturePurchasePage product={product} />;
}
