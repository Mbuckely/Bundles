"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { textureCategories } from "@/data/textures";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CART_UPDATED_EVENT, getCartItemCount } from "@/lib/cart";

const navigationLinks = [
  { label: "Home", href: "/" },
  {
    label: "Textures",
    href: "/#shop-hair",
    children: textureCategories.map((texture) => ({
      label: texture.name,
      href: texture.href,
    })),
  },
  { label: "Pricing", href: "/pricing" },
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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function syncCartCount() {
      setCartCount(getCartItemCount());
    }

    syncCartCount();
    window.addEventListener(CART_UPDATED_EVENT, syncCartCount);
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#DFC9BE]/95 shadow-[0_10px_30px_rgba(38,19,15,0.1)] backdrop-blur">
      <div className="site-container relative flex min-h-[3.75rem] items-center justify-between gap-4 py-3 md:min-h-[4.25rem]">
        <div className="hidden w-10 sm:block" aria-hidden="true" />

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-center font-body text-lg font-extrabold uppercase tracking-wide text-[#26130F] outline-none transition hover:text-[#FFB000] hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-2 sm:text-xl lg:text-2xl"
        >
          RRLUX EXTENSIONS
        </Link>

        <div className="ml-auto flex items-center gap-2 text-[#33201A]">
          <Link
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#DFC9BE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-2"
            href="/cart"
          >
            <CartIcon />
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#26130F] px-1 text-[10px] font-bold leading-none text-white">
              {cartCount}
            </span>
          </Link>
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-[#DFC9BE]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A6049] focus-visible:ring-offset-2 md:hidden"
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
        <ul className="site-container flex h-11 items-center justify-center gap-8 text-sm font-semibold text-[#4D3027] lg:gap-12">
          {navigationLinks.map((link) => (
            <li className="group relative" key={link.label}>
              <Link
                aria-haspopup={link.children ? "menu" : undefined}
                className="inline-flex min-h-8 items-center transition hover:font-bold hover:text-[#FFB000] hover:underline hover:decoration-[#FFB000] hover:decoration-2 hover:underline-offset-4 hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-2"
                href={link.href}
              >
                {link.label}
              </Link>

              {link.children ? (
                <ul
                  className="invisible absolute left-1/2 top-full z-50 min-w-44 -translate-x-1/2 pt-2 text-center text-sm opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                  role="menu"
                >
                  {link.children.map((child) => (
                    <li key={child.label} role="none">
                      <Link
                        className="flex min-h-9 items-center justify-center px-4 py-2 text-[#33201A] transition hover:font-bold hover:text-[#FFB000] hover:underline hover:decoration-[#FFB000] hover:decoration-2 hover:underline-offset-4 hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB000]"
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
