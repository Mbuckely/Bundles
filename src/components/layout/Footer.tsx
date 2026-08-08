"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    label: "Book An Experience",
    href: "https://app.acuityscheduling.com/schedule/06e329e8",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <footer
      className="relative left-1/2 w-screen -translate-x-1/2 border-t border-[#9A6049]/20 bg-[#FBF8F5]"
      id="contact"
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center justify-center px-6 py-10 text-center sm:px-8 sm:py-12">
        <Link
          aria-label="RR LUX Extensions home"
          className="font-sans text-[22px] font-semibold tracking-[0.08em] text-[#26130F] transition hover:text-[#9A6049]"
          href="/"
        >
        
        </Link>

   <nav className="mt-6 w-full">
  <ul className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-3">

    {!isHomePage && (
      <li>
        <Link
          className="font-sans text-[14px] font-medium text-[#4D3027] transition hover:text-[#9A6049]"
          href="/"
        >
          Home
        </Link>
      </li>
    )}

    {footerLinks.map((link) => (
      <li key={link.label}>
        <Link
          className="font-sans text-[14px] font-medium text-[#4D3027] transition hover:text-[#9A6049]"
          href={link.href}
        >
          {link.label}
        </Link>
      </li>
    ))}

    {/* Instagram */}
    <li>
  <a
    href="https://www.instagram.com/rea_recreations/?hl=en"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="flex items-center justify-center text-[#B57979] transition hover:text-[#5C382E]"
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-[20px] w-[20px]"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="17.2"
        cy="6.8"
        r="1"
        fill="currentColor"
      />
    </svg>
  </a>
</li>
    {/* TikTok */}
    <li>
      <a
        href="https://www.tiktok.com/@rea_recreations"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        className="flex items-center justify-center text-[#B57979] transition hover:text-[#5C382E]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-[20px] w-[20px]"
        >
          <path d="M15.5 3c.3 2.2 1.6 3.6 3.8 3.8v3.1c-1.3 0-2.5-.3-3.7-.9v5.7c0 4.1-4.5 6.7-8.1 4.6-2.3-1.4-3.2-4.4-2-6.8 1.1-2.2 3.6-3.4 6-2.8v3.2c-.4-.1-.8-.2-1.2-.1-1 .1-1.9.8-2.2 1.8-.4 1.3.3 2.7 1.5 3.2 1.7.7 3.5-.6 3.5-2.3V3h2.4Z" />
        </svg>
      </a>
    </li>

  </ul>
</nav>

        <div className="mt-7 h-px w-full max-w-[760px] bg-[#9A6049]/20" />

        <p className="mt-5 font-sans text-[13px] font-normal text-[#4D3027]">
          &copy; {year} RR LUX EXTENSIONS
        </p>
      </div>
    </footer>
  );
}