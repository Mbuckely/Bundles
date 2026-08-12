import Image from "next/image";

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
  },
  {
    id: "option-5",
    number: "5",
    label: "Minimal luxury",
    sectionClassName: "min-h-[590px] md:min-h-[660px]",
    imagePosition: "center 42%",
    overlayClassName:
      "bg-[linear-gradient(180deg,rgba(251,247,243,0.1)_0%,rgba(251,247,243,0.74)_58%,rgba(251,247,243,0.92)_100%)]",
    contentClassName:
      "site-container flex min-h-[590px] flex-col items-center justify-end px-4 pb-16 pt-28 text-center md:min-h-[660px] md:pb-20",
    headingClassName:
      "max-w-3xl font-heading text-5xl font-bold text-[#26130F] drop-shadow-[0_2px_16px_rgba(251,247,243,0.7)] sm:text-6xl md:text-7xl",
    bodyClassName:
      "mt-5 max-w-xl font-body text-base font-semibold leading-8 text-[#4D3027] sm:text-lg",
  },
  {
    id: "option-6",
    number: "6",
    label: "Gallery edge",
    sectionClassName: "min-h-[610px] md:min-h-[690px]",
    imagePosition: "center 33%",
    overlayClassName:
      "bg-[linear-gradient(90deg,rgba(251,247,243,0.92)_0%,rgba(251,247,243,0.78)_34%,rgba(119,72,53,0.24)_58%,rgba(38,19,15,0.44)_100%)]",
    contentClassName:
      "site-container flex min-h-[610px] flex-col justify-center px-4 py-20 text-left md:min-h-[690px]",
    headingClassName:
      "max-w-xl font-heading text-5xl font-bold text-[#26130F] drop-shadow-[0_1px_12px_rgba(251,247,243,0.8)] sm:text-6xl md:text-7xl",
    bodyClassName:
      "mt-6 max-w-md font-body text-base font-semibold leading-8 text-[#4D3027] sm:text-lg",
  },
  {
    id: "option-7",
    number: "7",
    label: "Magazine cover",
    sectionClassName: "min-h-[620px] md:min-h-[720px]",
    imagePosition: "center 30%",
    overlayClassName:
      "bg-[linear-gradient(180deg,rgba(38,19,15,0.58)_0%,rgba(38,19,15,0.08)_36%,rgba(38,19,15,0.7)_100%)]",
    contentClassName:
      "mx-auto flex min-h-[620px] max-w-5xl flex-col items-center justify-between px-4 pb-14 pt-24 text-center md:min-h-[720px] md:pb-16",
    headingClassName:
      "max-w-5xl font-heading text-5xl font-bold text-[#FFF9F5] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-6xl md:text-8xl",
    bodyClassName:
      "max-w-2xl font-body text-base font-medium leading-8 text-[#F5ECE6] drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)] sm:text-lg",
  },
];

function HeroExamplePanel({
  example,
  preload,
}: {
  example: HeroExample;
  preload: boolean;
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
        preload={preload}
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
      </div>
    </section>
  );
}

export function HeroChoiceReview() {
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
            Review the homepage hero directions below and note the option that
            feels most aligned.
          </p>
        </div>
      </section>

      {heroExamples.map((example, index) => (
        <HeroExamplePanel
          example={example}
          key={example.id}
          preload={index === 0}
        />
      ))}
    </main>
  );
}
