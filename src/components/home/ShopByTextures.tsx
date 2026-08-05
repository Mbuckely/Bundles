"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { textureCategories } from "@/data/textures";
import type { TextureCategory } from "@/types/texture";

type TextureLoadStatus = "loading" | "ready" | "error";

function isTextureCategory(value: unknown): value is TextureCategory {
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
  value: unknown,
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
  return error instanceof DOMException && error.name === "AbortError";
}

async function requestTextures(signal?: AbortSignal) {
  const response = await fetch("/api/textures", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("Unable to load textures.");
  }

  const data: unknown = await response.json();

  if (!isTextureResponse(data)) {
    throw new Error("Texture response was not valid.");
  }

  return data.textures;
}

function TextureCard({
  texture,
}: {
  texture: TextureCategory;
}) {
  return (
    <Link
      className="group relative block aspect-[3/4] overflow-hidden outline-none"
      href={texture.href}
      id={texture.id}
    >
      <Image
        alt={`${texture.name} hair texture`}
        className="object-cover transition duration-500 ease-out group-hover:scale-105"
        fill
        sizes="(min-width: 640px) 33vw, 100vw"
        src={texture.image}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.55)_100%)] transition group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_45%,rgba(0,0,0,0.6)_100%)]"
      />

      <span className="absolute inset-x-4 bottom-6 flex justify-center sm:bottom-9">
        <span className="relative font-heading text-xl font-bold uppercase tracking-[0.12em] text-white transition group-hover:text-[#FFB000] group-hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.75)] group-focus-visible:text-[#FFB000] sm:text-2xl">
          {texture.name}

          <span className="absolute inset-x-0 -bottom-1.5 h-[2px] origin-center scale-x-0 bg-[#FFB000] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
        </span>
      </span>

      <span
        aria-hidden="true"
        className="absolute inset-0 ring-1 ring-inset ring-white/0 transition group-hover:ring-[#FFB000]/55 group-focus-visible:ring-[#FFB000]/80"
      />
    </Link>
  );
}

function TextureSkeleton({ index }: { index: number }) {
  return (
    <div
      aria-hidden="true"
      className="texture-reveal relative aspect-[3/4] overflow-hidden bg-[#DFC9BE]"
      style={{
        animationDelay: `${100 + index * 130}ms`,
      }}
    >
      <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(251,247,243,0)_0%,rgba(251,247,243,0.58)_45%,rgba(251,247,243,0)_90%)]" />
      <div className="absolute inset-x-8 bottom-8 h-5 bg-white/60" />
    </div>
  );
}

export function ShopByTextures() {
  const [textures, setTextures] =
    useState<TextureCategory[]>(textureCategories);
  const [status, setStatus] = useState<TextureLoadStatus>("ready");

  const retryTextureLoad = useCallback(async () => {
    setStatus("loading");

    try {
      const nextTextures = await requestTextures();

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
    const controller = new AbortController();

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
      className="scroll-mt-32 bg-[#FBF7F3] pb-40 pt-16 md:pb-52 md:pt-20"
      id="shop-hair"
    >
      <div className="site-container">
        <h2 className="texture-reveal font-body text-2xl font-extrabold uppercase tracking-[0.06em] text-[#8B523B] sm:text-3xl">
          Shop by Texture
        </h2>

        {/* Space between heading and texture cards */}
        <div aria-hidden="true" style={{ height: "45px" }} />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {status === "loading" && textures.length === 0
            ? Array.from({ length: 3 }).map((_, index) => (
                <TextureSkeleton index={index} key={index} />
              ))
            : textures.map((texture, index) => (
                <div
                  className="texture-reveal"
                  key={texture.id}
                  style={{
                    animationDelay: `${100 + index * 130}ms`,
                  }}
                >
                  <TextureCard texture={texture} />
                </div>
              ))}
        </div>

        {status === "error" && textures.length === 0 ? (
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

        {/* Space between texture cards and Shop Now */}
        <div aria-hidden="true" style={{ height: "35px" }} />

        <div className="flex justify-center">
          <Link
            className="texture-reveal font-body text-sm font-extrabold uppercase tracking-[0.18em] text-[#33201A] underline decoration-[#9A6049]/45 decoration-2 underline-offset-8 transition hover:text-[#FFB000] hover:decoration-[#FFB000] hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-4"
            href="#contact"
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
