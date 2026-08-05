const backgroundImage = "/hero/bundle-stand.png";

type PricingItem = {
  length: string;
  oneBundle: number;
  twoBundles: number;
  threeBundles: number;
};

const pricing: PricingItem[] = [
  { length: '12"', oneBundle: 100, twoBundles: 195, threeBundles: 285 },
  { length: '14"', oneBundle: 110, twoBundles: 215, threeBundles: 315 },
  { length: '16"', oneBundle: 120, twoBundles: 235, threeBundles: 345 },
  { length: '18"', oneBundle: 135, twoBundles: 265, threeBundles: 390 },
  { length: '20"', oneBundle: 150, twoBundles: 295, threeBundles: 435 },
  { length: '22"', oneBundle: 165, twoBundles: 325, threeBundles: 480 },
  { length: '24"', oneBundle: 185, twoBundles: 365, threeBundles: 540 },
  { length: '26"', oneBundle: 205, twoBundles: 405, threeBundles: 600 },
  { length: '28"', oneBundle: 225, twoBundles: 445, threeBundles: 660 },
  { length: '30"', oneBundle: 250, twoBundles: 495, threeBundles: 735 },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#2D1B17] text-[#26130F]">
      {/* Existing blurred background */}
  {/* Background image layers */}
<div aria-hidden="true" className="absolute inset-0 overflow-hidden">
  {/* Fills the sides */}
  <div
    className="absolute inset-0 scale-110 bg-cover bg-center blur-[5px]"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  />

  {/* Shows the complete image */}
  <div
    className="absolute inset-0 bg-contain bg-center bg-no-repeat blur-[4px]"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  />
</div>

      {/* Existing beige overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#EAD8CF]/55"
      />

      {/* Existing gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(45,27,23,0.38)_0%,rgba(252,249,246,0.38)_45%,rgba(45,27,23,0.48)_100%)]"
      />

      <section
        className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pb-20 sm:px-6 lg:px-8"
        style={{ paddingTop: "clamp(9rem, 15vh, 11rem)" }}
      >
        {/* Page heading */}
        <header className="mx-auto max-w-3xl text-center">
          

          <h1 className="font-heading text-5xl font-semibold leading-none text-[#26130F] drop-shadow-[0_1px_1px_rgba(252,249,246,0.45)] sm:text-6xl lg:text-7xl">
            Bundle Pricing
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#4E302A] drop-shadow-[0_1px_1px_rgba(252,249,246,0.5)] sm:text-base">
            Choose your preferred hair length and bundle quantity.
            Three bundles are recommended for a full installation.
          </p>
        </header>

        {/* Desktop pricing */}
        <section
          aria-labelledby="desktop-pricing-heading"
          className="mt-32 hidden w-full max-w-5xl md:block"
        >
          <h2 id="desktop-pricing-heading" className="sr-only">
            Raw hair bundle prices
          </h2>

          {/* Column headings */}
          <div className="grid grid-cols-[0.75fr_1fr_1fr_1fr] items-center border-y border-[#321B16]/50 py-4 text-center">
            <p className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-[#321B16]">
              Length
            </p>

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#321B16]">
              1 Bundle
            </p>

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#321B16]">
              2 Bundles
            </p>

            <div className="flex items-center justify-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#321B16]">
                3 Bundles
              </p>

              <span className="rounded-full bg-[#321B16] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#F8EEE8]">
                Best value
              </span>
            </div>
          </div>

          {/* Pricing rows */}
          <div>
            {pricing.map((item, index) => (
              <div
                key={item.length}
                className="pricing-row-enter group grid grid-cols-[0.75fr_1fr_1fr_1fr] items-center border-b border-[#321B16]/30 py-5 text-center transition-colors duration-200 hover:border-[#321B16]/70"
                style={{
                  animationDelay: `${index * 110}ms`,
                }}
              >
                <p className="text-left font-heading text-3xl font-semibold italic text-[#26130F] drop-shadow-[0_1px_1px_rgba(252,249,246,0.55)]">
                  {item.length}
                </p>

                <p className="text-lg font-medium text-[#321B16] drop-shadow-[0_1px_1px_rgba(252,249,246,0.55)]">
                  {formatPrice(item.oneBundle)}
                </p>

                <p className="text-lg font-medium text-[#321B16] drop-shadow-[0_1px_1px_rgba(252,249,246,0.55)]">
                  {formatPrice(item.twoBundles)}
                </p>

                <p className="font-heading text-2xl font-semibold text-[#26130F] drop-shadow-[0_1px_1px_rgba(252,249,246,0.6)]">
                  {formatPrice(item.threeBundles)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile pricing */}
        <section
          aria-labelledby="mobile-pricing-heading"
          className="mt-20 w-full max-w-xl md:hidden"
        >
          <h2 id="mobile-pricing-heading" className="sr-only">
            Raw hair bundle prices
          </h2>

          {pricing.map((item, index) => (
            <article
              key={item.length}
              className={`pricing-row-enter border-b border-[#321B16]/35 py-6 ${
                index === 0 ? "border-t" : ""
              }`}
              style={{
                animationDelay: `${index * 110}ms`,
              }}
            >
              <div className="flex items-end justify-between">
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#543A33]">
                    Hair length
                  </p>

                  <h3 className="mt-1 font-heading text-4xl font-semibold italic text-[#26130F] drop-shadow-[0_1px_1px_rgba(252,249,246,0.55)]">
                    {item.length}
                  </h3>
                </div>

                <p className="pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#543A33]">
                  Raw Hair
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 text-center">
                <div className="px-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#543A33]">
                    1 Bundle
                  </p>

                  <p className="mt-2 text-lg font-semibold text-[#26130F]">
                    {formatPrice(item.oneBundle)}
                  </p>
                </div>

                <div className="border-x border-[#321B16]/25 px-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#543A33]">
                    2 Bundles
                  </p>

                  <p className="mt-2 text-lg font-semibold text-[#26130F]">
                    {formatPrice(item.twoBundles)}
                  </p>
                </div>

                <div className="px-2">
                  <div className="flex h-[14px] justify-center">
                    <span className="rounded-full bg-[#321B16] px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.1em] text-[#F8EEE8]">
                      Best value
                    </span>
                  </div>

                  <p className="mt-2 font-heading text-xl font-semibold text-[#26130F]">
                    {formatPrice(item.threeBundles)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-10 text-center">
          <p className="text-xs leading-5 text-[#4E302A] drop-shadow-[0_1px_1px_rgba(252,249,246,0.5)]">
            Shipping and applicable taxes are calculated during checkout.
          </p>
        </footer>
      </section>
    </main>
  );
}
