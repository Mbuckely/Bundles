import type { TextureCategory } from "@/types/texture";

export const textureCategories: TextureCategory[] = [
  {
    id: "kinky-straight",
    name: "Kinky Straight",
    image: "/textures/kinky-straight.png",
    href: "#kinky-straight",
  },
  {
    id: "natural-wavy",
    name: "Natural Wavy",
    image: "/textures/natural-wavy.png",
    href: "#natural-wavy",
  },
  {
    id: "burmese-curly",
    name: "Burmese Curly",
    image: "/textures/burmese-curly.png",
    href: "#burmese-curly",
  },
];

export function getTextureCategories() {
  return textureCategories.map((texture) => ({ ...texture }));
}
