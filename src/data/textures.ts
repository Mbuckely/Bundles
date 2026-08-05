import type { TextureCategory } from "@/types/texture";

export const textureCategories: TextureCategory[] = [
  {
    id: "kinky-straight",
    name: "Kinky Straight",
    image: "/textures/kinky-straight.png",
    href: "/textures/kinky-straight",
  },
  {
    id: "natural-wavy",
    name: "Natural Wavy",
    image: "/textures/natural-wavy.png",
    href: "/textures/natural-wavy",
  },
  {
    id: "burmese-curly",
    name: "Burmese Curly",
    image: "/hero/bundle-stand.png",
    href: "/textures/burmese-curly",
  },
];

export function getTextureCategories() {
  return textureCategories.map((texture) => ({ ...texture }));
}
