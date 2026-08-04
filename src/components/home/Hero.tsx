export function Hero() {
  return (
    <section className="bg-[linear-gradient(135deg,#FBF7F3_0%,#F1E4DD_38%,#DFC9BE_72%,#9A6049_140%)]">
      <div className="site-container flex min-h-[560px] flex-col items-center justify-center px-4 py-20 text-center md:py-28">
        <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-none text-[#26130F] sm:text-6xl lg:text-7xl">
          Luxury hair made{" "}
          <span className="text-[#8B523B]">effortless.</span>
        </h1>

        <p className="mt-6 max-w-2xl font-body text-base font-medium leading-8 text-[#4D3027] sm:text-lg">
          Premium extensions designed to blend naturally, style beautifully, and
          keep your look polished every day.
        </p>
      </div>
    </section>
  );
}
