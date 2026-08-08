"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { textureCategories } from "@/data/textures";
import { textureProducts } from "@/data/textureProducts";
import type { TextureCategory } from "@/types/texture";

type TextureLoadStatus = "loading" | "ready" | "error";

function isTextureCategory(
  value: unknown
): value is TextureCategory {
  if (!value || typeof value !== "object") {
    return false;
  }

  const texture = value as Record<string, unknown>;

  return (
    typeof texture.id === "string" &&
    typeof texture.name === "string" &&
    typeof texture.image === "string" &&
    typeof texture.href === "string"
  );
}

function isTextureResponse(
  value: unknown
): value is { textures: TextureCategory[] } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    Array.isArray(response.textures) &&
    response.textures.every(isTextureCategory)
  );
}

function isAbortError(error: unknown) {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

async function requestTextures(
  signal?: AbortSignal
) {
  const response = await fetch("/api/textures", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("Unable to load textures.");
  }

  const data: unknown = await response.json();

  if (!isTextureResponse(data)) {
    throw new Error(
      "Texture response was not valid."
    );
  }

  return data.textures;
}

function TextureCard({
  texture,
}: {
  texture: TextureCategory;
}) {
  const product = textureProducts.find(
    (item) => item.slug === texture.id
  );

  const mainImage =
    product?.images[0] ?? texture.image;

  const hoverImage =
    product?.images[1] ??
    product?.images[0] ??
    texture.image;

  return (
    <Link
      className="group relative block aspect-[3/4] overflow-hidden outline-none"
      href={texture.href}
    >
      {/* MAIN IMAGE */}
      <Image
        alt={`${texture.name} hair texture`}
        className="object-cover opacity-100 transition-opacity duration-150 ease-out group-hover:opacity-0"
        fill
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 90vw"
        src={mainImage}
      />

      {/* HOVER IMAGE */}
      <Image
        alt={`${texture.name} alternate view`}
        className="object-cover opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
        fill
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 90vw"
        src={hoverImage}
      />

      {/* DARK GRADIENT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.55)_100%)]"
      />

      {/* TEXTURE NAME */}
      <span className="absolute inset-x-4 bottom-6 flex justify-center sm:bottom-8">
        <span className="relative text-center font-heading text-lg font-bold uppercase tracking-[0.12em] text-white transition group-hover:text-[#FFB000] sm:text-xl">
          {texture.name}

          <span className="absolute inset-x-0 -bottom-1.5 h-[2px] origin-center scale-x-0 bg-[#FFB000] transition-transform duration-150 group-hover:scale-x-100" />
        </span>
      </span>

      {/* HOVER OUTLINE */}
      <span
        aria-hidden="true"
        className="absolute inset-0 ring-1 ring-inset ring-white/0 transition group-hover:ring-[#FFB000]/55"
      />
    </Link>
  );
}

function TextureSkeleton({
  index,
}: {
  index: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="texture-reveal relative aspect-[3/4] overflow-hidden bg-[#DFC9BE]"
      style={{
        animationDelay: `${100 + index * 130}ms`,
      }}
    >
      <div className="absolute inset-0 animate-pulse bg-white/20" />
    </div>
  );
}

export function ShopByTextures() {
  const [textures, setTextures] =
    useState<TextureCategory[]>(
      textureCategories
    );

  const [status, setStatus] =
    useState<TextureLoadStatus>("ready");

  const retryTextureLoad =
    useCallback(async () => {
      setStatus("loading");

      try {
        const nextTextures =
          await requestTextures();

        setTextures(nextTextures);
        setStatus("ready");
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        setStatus("error");
      }
    }, []);

  useEffect(() => {
    const controller =
      new AbortController();

    requestTextures(controller.signal)
      .then((nextTextures) => {
        setTextures(nextTextures);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) {
          return;
        }

        setStatus("error");
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section
      aria-busy={status === "loading"}
      className="scroll-mt-32 bg-[#FBF7F3] pb-40 pt-24 md:pb-52 md:pt-28"
      id="shop-hair"
    >
      <div className="mx-auto w-full max-w-[1050px] px-6 sm:px-8 lg:px-10">
        {/* HEADING */}
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold uppercase tracking-[0.08em] text-[#33201A] sm:text-4xl">
              Shop by Texture
            </h2>
          </div>
        </ScrollReveal>

        {/* SPACE */}
        <div
          aria-hidden="true"
          style={{ height: "45px" }}
        />

        {/* TEXTURE CARDS */}
        <div className="mx-auto grid w-full max-w-[900px] grid-cols-1 justify-items-center gap-5 sm:grid-cols-3">
          {status === "loading" &&
          textures.length === 0
            ? Array.from({
                length: 3,
              }).map((_, index) => (
                <div
                  className="w-full max-w-[270px]"
                  key={index}
                >
                  <TextureSkeleton
                    index={index}
                  />
                </div>
              ))
            : textures.map(
                (texture, index) => (
                  <ScrollReveal
                    className="w-full max-w-[270px]"
                    delay={index * 120}
                    key={texture.id}
                  >
                    <TextureCard
                      texture={texture}
                    />
                  </ScrollReveal>
                )
              )}
        </div>

        {/* ERROR */}
        {status === "error" &&
        textures.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <p className="max-w-md text-sm font-semibold text-[#4D3027]">
              We could not load the texture options right now.
            </p>

            <button
              className="rounded-sm border border-[#33201A] px-5 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#33201A] transition hover:bg-[#33201A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-4"
              type="button"
              onClick={() => {
                void retryTextureLoad();
              }}
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* SPACE BETWEEN CARDS AND SHOP NOW */}
        <div
          aria-hidden="true"
          style={{ height: "45px" }}
        />

        {/* SHOP NOW */}
        <div className="flex justify-center">
          <Link
            className="texture-reveal font-body text-sm font-extrabold uppercase tracking-[0.18em] text-[#33201A] underline decoration-[#9A6049]/45 decoration-2 underline-offset-8 transition hover:text-[#FFB000] hover:decoration-[#FFB000] hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-4"
            href="/textures/kinky-straight"
            style={{
              animationDelay: "560ms",
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}