"use client";

import Link from "next/link";

type MobileMenuProps = {
  isOpen: boolean;
  links: {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
  }[];
  onClose: () => void;
};

export function MobileMenu({ isOpen, links, onClose }: MobileMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="border-t border-[#9A6049]/25 bg-[#DFC9BE] px-5 py-5 shadow-sm md:hidden">
      <nav aria-label="Mobile navigation">
        <ul className="grid gap-2">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                className="block py-3 text-sm font-semibold text-[#33201A] outline-none transition hover:font-bold hover:text-[#FFB000] hover:underline hover:decoration-[#FFB000] hover:decoration-2 hover:underline-offset-4 hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-2"
                href={link.href}
                onClick={onClose}
              >
                {link.label}
              </Link>
              {link.children ? (
                <ul className="ml-4 grid gap-1 border-l border-[#DFC9BE] pl-4">
                  {link.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        className="block py-2 text-sm font-medium text-[#5C382D] outline-none transition hover:font-bold hover:text-[#FFB000] hover:underline hover:decoration-[#FFB000] hover:decoration-2 hover:underline-offset-4 hover:drop-shadow-[0_1px_1px_rgba(38,19,15,0.65)] focus-visible:ring-2 focus-visible:ring-[#FFB000] focus-visible:ring-offset-2"
                        href={child.href}
                        onClick={onClose}
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
    </div>
  );
}
