import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate min-h-[590px] overflow-hidden border-b border-[#EFE4DD] bg-[#FBF7F3] md:min-h-[660px]">
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

      <div className="relative z-10 mx-auto flex min-h-[590px] max-w-3xl flex-col items-center justify-center px-5 pb-28 pt-20 text-center md:min-h-[660px] md:pb-32">
        <h1 className="luxury-shimmer mx-auto w-full max-w-[21rem] text-balance font-heading text-[2.65rem] font-bold leading-[0.98] drop-shadow-[0_2px_18px_rgba(45,27,23,0.46)] sm:max-w-3xl sm:text-6xl sm:leading-[0.95] md:text-7xl">
          Luxury Hair Made Effortless
        </h1>
      </div>
    </section>
  );
}
