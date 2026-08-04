import { getTextureCategories } from "@/data/textures";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const response = NextResponse.json({
    textures: getTextureCategories(),
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
