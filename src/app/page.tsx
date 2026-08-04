import { Hero } from "@/components/home/Hero";
import { ShopByTextures } from "@/components/home/ShopByTextures";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F1E4DD]">
      <Hero />
      <ShopByTextures />
    </main>
  );
}
