import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate min-h-[590px] overflow-hidden bg-[#FBF7F3] md:min-h-[660px]">
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover brightness-[0.84] contrast-[1.05] saturate-[0.96]"
        fill
        preload
        sizes="100vw"
        src="/rea/rea.jpg"
        style={{ objectPosition: "center 38%" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,27,23,0.18)_0%,rgba(80,49,38,0.08)_42%,rgba(45,27,23,0.28)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(45,27,23,0.26)_0%,rgba(45,27,23,0.12)_34%,rgba(45,27,23,0)_64%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(251,247,243,0)_0%,rgba(251,247,243,0.12)_74%,#FBF7F3_100%)] md:h-40"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-20 w-full text-[#FBF7F3] md:h-24"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        <path
          d="M0 56C194 30 378 28 574 43C774 59 930 77 1128 60C1264 48 1362 31 1440 22V120H0Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[590px] max-w-3xl flex-col items-center justify-center px-5 pb-28 pt-20 text-center md:min-h-[660px] md:pb-32">
        <h1 className="luxury-shimmer mx-auto w-full max-w-[21rem] text-balance font-heading text-[2.65rem] font-bold leading-[0.98] drop-shadow-[0_2px_18px_rgba(45,27,23,0.46)] sm:max-w-3xl sm:text-6xl sm:leading-[0.95] md:text-7xl">
          Luxury Hair Made Effortless
        </h1>

        <p className="mx-auto mt-6 w-full max-w-[21rem] text-balance font-body text-sm font-semibold leading-7 text-[#FFF9F5] drop-shadow-[0_2px_14px_rgba(45,27,23,0.52)] sm:max-w-2xl sm:text-lg sm:leading-8">
          Premium extensions designed to blend naturally, style beautifully, and
          keep your look polished every day.
        </p>
      </div>
    </section>
  );
}
