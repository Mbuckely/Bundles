import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="site-container my-4 border-t border-[#9A6049]/25 py-5 text-sm"
      id="contact"
    >
      <div className="grid gap-6 md:grid-cols-3 md:items-center">
        <Link
          aria-label="RRLUX Extensions home"
          className="justify-self-start font-heading text-2xl font-semibold text-[#26130F] transition hover:font-bold hover:text-[#FFB000] hover:underline hover:decoration-[#FFB000] hover:decoration-2 hover:underline-offset-4 hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-2"
          href="/"
        >
          RRLUX
        </Link>

        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:col-start-2">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link
                className="font-medium text-[#4D3027] transition hover:font-bold hover:text-[#FFB000] hover:underline hover:decoration-[#FFB000] hover:decoration-2 hover:underline-offset-4 hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-2"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <form className="grid gap-2 md:justify-self-end">
          <div>
            <h5 className="font-heading text-lg font-semibold text-[#26130F]">
              Subscribe to our newsletter
            </h5>
            <p className="mt-1 text-sm text-[#4D3027]">
              Be first to know about new drops and bundle offers.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <label className="sr-only" htmlFor="newsletter1">
              Email address
            </label>
            <input
              className="min-h-10 rounded border border-[#9A6049]/35 bg-white px-3 text-sm text-[#26130F] outline-none transition placeholder:text-[#4D3027]/45 focus:border-[#8B523B] focus:ring-2 focus:ring-[#9A6049]/35"
              id="newsletter1"
              placeholder="Email address"
              type="email"
            />
            <button
              className="min-h-10 rounded bg-[#33201A] px-4 text-sm font-semibold text-white transition hover:bg-[#8B523B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-2"
              type="button"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>

      <p className="mt-6 text-center font-medium text-[#4D3027]">
        &copy; {year} RRLUX Extensions
      </p>
    </footer>
  );
}
