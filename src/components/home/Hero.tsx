import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate min-h-[590px] overflow-hidden md:min-h-[660px]">
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover"
        fill
        preload
        sizes="100vw"
        src="/rea/rea.jpg"
        style={{ objectPosition: "center 38%" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,247,243,0.78)_0%,rgba(241,228,221,0.62)_45%,rgba(51,32,26,0.38)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[590px] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center md:min-h-[660px]">
        <h1 className="max-w-3xl font-heading text-5xl font-bold text-[#26130F] drop-shadow-[0_2px_18px_rgba(251,247,243,0.65)] sm:text-6xl md:text-7xl">
          Luxury Hair Made Effortless
        </h1>

        <p className="mt-6 max-w-2xl font-body text-base font-semibold leading-8 text-[#33201A] drop-shadow-[0_1px_12px_rgba(251,247,243,0.8)] sm:text-lg">
          Premium extensions designed to blend naturally, style beautifully, and
          keep your look polished every day.
        </p>
      </div>
    </section>
  );
}
