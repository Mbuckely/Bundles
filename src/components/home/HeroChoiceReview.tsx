"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type HeroExample = {
  id: string;
  number: string;
  label: string;
  sectionClassName: string;
  imagePosition: string;
  overlayClassName: string;
  contentClassName: string;
  headingClassName: string;
  bodyClassName: string;
  buttonClassName: string;
};

const heroExamples: HeroExample[] = [
  {
    id: "option-1",
    number: "1",
    label: "Soft centered",
    sectionClassName: "min-h-[590px] md:min-h-[660px]",
    imagePosition: "center 38%",
    overlayClassName:
      "bg-[linear-gradient(180deg,rgba(251,247,243,0.78)_0%,rgba(241,228,221,0.62)_45%,rgba(51,32,26,0.38)_100%)]",
    contentClassName:
      "mx-auto flex min-h-[590px] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center md:min-h-[660px]",
    headingClassName:
      "max-w-3xl font-heading text-5xl font-bold text-[#26130F] drop-shadow-[0_2px_18px_rgba(251,247,243,0.65)] sm:text-6xl md:text-7xl",
    bodyClassName:
      "mt-6 max-w-2xl font-body text-base font-semibold leading-8 text-[#33201A] drop-shadow-[0_1px_12px_rgba(251,247,243,0.8)] sm:text-lg",
    buttonClassName:
      "border-[#26130F] bg-[#26130F] text-[#FFF9F5] hover:bg-[#5C382D]",
  },
  {
    id: "option-2",
    number: "2",
    label: "Editorial left",
    sectionClassName: "min-h-[590px] md:min-h-[680px]",
    imagePosition: "center 31%",
    overlayClassName:
      "bg-[linear-gradient(90deg,rgba(38,19,15,0.88)_0%,rgba(51,32,26,0.66)_42%,rgba(51,32,26,0.2)_72%,rgba(51,32,26,0.04)_100%)]",
    contentClassName:
      "site-container flex min-h-[590px] flex-col justify-center px-4 py-20 text-left md:min-h-[680px]",
    headingClassName:
      "max-w-2xl font-heading text-5xl font-bold text-[#FFF9F5] drop-shadow-[0_3px_18px_rgba(0,0,0,0.35)] sm:text-6xl md:text-7xl",
    bodyClassName:
      "mt-6 max-w-xl font-body text-base font-medium leading-8 text-[#F1E4DD] sm:text-lg",
    buttonClassName:
      "border-[#FFF9F5] bg-[#FFF9F5] text-[#26130F] hover:bg-[#F1E4DD]",
  },
  {
    id: "option-3",
    number: "3",
    label: "Clean boutique",
    sectionClassName: "min-h-[590px] md:min-h-[660px]",
    imagePosition: "center 34%",
    overlayClassName:
      "bg-[linear-gradient(90deg,rgba(251,247,243,0.08)_0%,rgba(251,247,243,0.18)_35%,rgba(251,247,243,0.86)_64%,rgba(241,228,221,0.94)_100%)]",
    contentClassName:
      "site-container flex min-h-[590px] flex-col items-center justify-center px-4 py-20 text-center md:min-h-[660px] md:items-end md:text-right",
    headingClassName:
      "max-w-xl font-heading text-5xl font-bold text-[#26130F] drop-shadow-[0_1px_14px_rgba(251,247,243,0.85)] sm:text-6xl md:text-7xl",
    bodyClassName:
      "mt-6 max-w-md font-body text-base font-semibold leading-8 text-[#4D3027] drop-shadow-[0_1px_10px_rgba(251,247,243,0.85)] sm:text-lg",
    buttonClassName:
      "border-[#26130F] bg-[#26130F] text-[#FFF9F5] hover:bg-[#5C382D]",
  },
  {
    id: "option-4",
    number: "4",
    label: "Warm dramatic",
    sectionClassName: "min-h-[610px] md:min-h-[700px]",
    imagePosition: "center 29%",
    overlayClassName:
      "bg-[linear-gradient(180deg,rgba(38,19,15,0.18)_0%,rgba(38,19,15,0.32)_42%,rgba(38,19,15,0.86)_100%)]",
    contentClassName:
      "site-container flex min-h-[610px] flex-col justify-end px-4 pb-16 pt-32 text-left md:min-h-[700px] md:pb-20",
    headingClassName:
      "max-w-4xl font-heading text-5xl font-bold text-[#FFF9F5] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl",
    bodyClassName:
      "mt-6 max-w-2xl font-body text-base font-medium leading-8 text-[#F5ECE6] sm:text-lg",
    buttonClassName:
      "border-[#FFF9F5] bg-[#FFF9F5] text-[#26130F] hover:bg-[#F1E4DD]",
  },
];

function buildSelectionMessage(example: HeroExample, reviewUrl: string) {
  const urlLine = reviewUrl ? `\nReview link: ${reviewUrl}` : "";

  return `I choose Option ${example.number}: ${example.label}.${urlLine}`;
}

function HeroExamplePanel({
  example,
  isSelected,
  priority,
  onSelect,
}: {
  example: HeroExample;
  isSelected: boolean;
  priority: boolean;
  onSelect: (example: HeroExample) => void;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden ${example.sectionClassName}`}
      id={example.id}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover"
        fill
        priority={priority}
        sizes="100vw"
        src="/rea/rea.jpg"
        style={{ objectPosition: example.imagePosition }}
      />
      <div className={`absolute inset-0 ${example.overlayClassName}`} />
      <div className="absolute left-4 top-4 z-10 rounded-sm bg-[#FBF7F3]/88 px-4 py-2 font-body text-xs font-bold uppercase text-[#33201A] shadow-[0_8px_24px_rgba(38,19,15,0.18)] md:left-8 md:top-8">
        Option {example.number} / {example.label}
      </div>
      <div className={`relative z-10 ${example.contentClassName}`}>
        <h2 className={example.headingClassName}>
          Luxury Hair Made Effortless
        </h2>
        <p className={example.bodyClassName}>
          Premium extensions designed to blend naturally, style beautifully, and
          keep your look polished every day.
        </p>
        <button
          className={`mt-8 min-h-12 border px-6 py-3 font-body text-sm font-bold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-2 ${example.buttonClassName}`}
          aria-pressed={isSelected}
          type="button"
          onClick={() => onSelect(example)}
        >
          {isSelected ? "Selected" : `Choose Option ${example.number}`}
        </button>
      </div>
    </section>
  );
}

export function HeroChoiceReview() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  const selectedExample = useMemo(
    () => heroExamples.find((example) => example.id === selectedId) ?? null,
    [selectedId],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const hashId = window.location.hash.replace("#", "");

      if (heroExamples.some((example) => example.id === hashId)) {
        setSelectedId(hashId);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  function handleSelect(example: HeroExample) {
    setSelectedId(example.id);
    setCopyStatus("");
    window.history.replaceState(null, "", `#${example.id}`);
  }

  function getSelectionMessage() {
    if (!selectedExample) {
      return "";
    }

    return buildSelectionMessage(
      selectedExample,
      `${window.location.origin}/hero-review#${selectedExample.id}`,
    );
  }

  async function copySelection() {
    const selectionMessage = getSelectionMessage();

    if (!selectionMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(selectionMessage);
      setCopyStatus("Selection copied.");
    } catch {
      setCopyStatus("Copy did not work. Email selection is still available.");
    }
  }

  function emailSelection() {
    const selectionMessage = getSelectionMessage();

    if (!selectionMessage) {
      return;
    }

    window.location.href = `mailto:?subject=${encodeURIComponent(
      "RR LUX hero selection",
    )}&body=${encodeURIComponent(selectionMessage)}`;
  }

  return (
    <main className="bg-[#26130F]">
      <section className="bg-[#FBF7F3] px-4 py-12 text-center text-[#26130F] md:py-16">
        <div className="site-container mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase text-[#8B523B]">
            RR LUX Extensions
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold sm:text-5xl md:text-6xl">
            Hero Direction Review
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base font-medium leading-8 text-[#4D3027]">
            Select the direction that feels most aligned for the homepage.
          </p>
        </div>
      </section>

      {heroExamples.map((example, index) => (
        <HeroExamplePanel
          example={example}
          isSelected={selectedId === example.id}
          key={example.label}
          onSelect={handleSelect}
          priority={index === 0}
        />
      ))}

      <aside className="sticky bottom-0 z-30 border-t border-[#DFC9BE] bg-[#FBF7F3]/95 px-4 py-4 shadow-[0_-12px_32px_rgba(38,19,15,0.18)] backdrop-blur">
        <div className="site-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-body text-xs font-bold uppercase text-[#8B523B]">
              Selection
            </p>
            <p className="mt-1 font-body text-sm font-semibold text-[#26130F] sm:text-base">
              {selectedExample
                ? `Option ${selectedExample.number}: ${selectedExample.label}`
                : "No option selected"}
            </p>
            <p aria-live="polite" className="mt-1 min-h-5 text-sm text-[#5C382D]">
              {copyStatus}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="min-h-11 border border-[#26130F] bg-[#26130F] px-5 py-2.5 font-body text-sm font-bold uppercase text-[#FFF9F5] transition hover:bg-[#5C382D] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!selectedExample}
              type="button"
              onClick={copySelection}
            >
              Copy Selection
            </button>
            <button
              className="min-h-11 border border-[#26130F] px-5 py-2.5 text-center font-body text-sm font-bold uppercase text-[#26130F] transition hover:bg-[#F1E4DD] disabled:cursor-not-allowed disabled:border-[#26130F]/25 disabled:text-[#26130F]/35"
              disabled={!selectedExample}
              type="button"
              onClick={emailSelection}
            >
              Email Selection
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}
