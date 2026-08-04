"use client";

import Link from "next/link";
import { useState } from "react";
import { textureCategories } from "@/data/textures";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navigationLinks = [
  { label: "Home", href: "/" },
  {
    label: "Textures",
    href: "/#shop-hair",
    children: textureCategories.map((texture) => ({
      label: texture.name,
      href: `/${texture.href}`,
    })),
  },
  { label: "Contact", href: "/#contact" },
];

function CartIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M3.5 5h2.2l2.1 10.2a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 1.9-1.4L20 9H7.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="10" cy="20" r="1.25" fill="currentColor" />
      <circle cx="17" cy="20" r="1.25" fill="currentColor" />
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      {isOpen ? (
        <path
          d="M6 6l12 12M18 6 6 18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#DFC9BE]/95 shadow-[0_10px_30px_rgba(38,19,15,0.1)] backdrop-blur">
      <div className="site-container relative flex min-h-[4.75rem] items-center justify-between gap-4 py-4 md:min-h-[5.25rem]">
        <div className="hidden w-10 sm:block" aria-hidden="true" />

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-center font-body text-xl font-extrabold uppercase tracking-wide text-[#26130F] outline-none transition hover:text-[#5C382D] focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-2 sm:text-2xl lg:text-3xl"
        >
          RRLUX EXTENSIONS
        </Link>

        <div className="ml-auto flex items-center gap-2 text-[#33201A]">
          <button
            aria-label="Cart"
            className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-[#DFC9BE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-2"
            type="button"
          >
            <CartIcon />
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#26130F] px-1 text-[10px] font-bold leading-none text-white">
              0
            </span>
          </button>
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#DFC9BE]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-2 md:hidden"
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="hidden md:block"
      >
        <ul className="site-container flex h-14 items-center justify-center gap-9 text-sm font-semibold text-[#4D3027] lg:gap-14">
          {navigationLinks.map((link) => (
            <li className="group relative" key={link.label}>
              <Link
                aria-haspopup={link.children ? "menu" : undefined}
                className="inline-flex min-h-10 items-center transition hover:text-[#26130F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-2"
                href={link.href}
              >
                {link.label}
              </Link>

              {link.children ? (
                <ul
                  className="invisible absolute left-1/2 top-full z-50 min-w-44 -translate-x-1/2 rounded bg-[#F1E4DD] p-2 text-center text-sm opacity-0 shadow-xl ring-1 ring-[#9A6049]/35 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                  role="menu"
                >
                  {link.children.map((child) => (
                    <li key={child.label} role="none">
                      <Link
                        className="flex min-h-9 items-center justify-center rounded px-4 py-2 text-[#33201A] transition hover:bg-[#9A6049] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049]"
                        href={child.href}
                        role="menuitem"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        links={navigationLinks}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
}
