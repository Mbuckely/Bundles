"use client";

import { useMemo, useState } from "react";

type Category = "All" | "Ordering" | "Hair Care" | "Shipping";

type Policy = {
  question: string;
  answer: string;
  category: Exclude<Category, "All">;
};

const categories: Category[] = [
  "All",
  "Ordering",
  "Hair Care",
  "Shipping",
];

const policies: Policy[] = [
  {
    question: "All Sales Are Final",
    answer:
      "All sales are final. No refunds or exchanges on opened, worn, altered, installed, colored, or used hair.",
    category: "Ordering",
  },
  {
    question: "Product Concerns",
    answer:
      "Contact us within 7 days with photos, videos, your order number, and a description of the concern. Concerns are reviewed case by case, and qualifying manufacturing defects may receive a replacement.",
    category: "Ordering",
  },
  {
    question: "Order Cancellations",
    answer:
      "Order cancellations cannot be guaranteed once processing begins.",
    category: "Ordering",
  },
  {
    question: "Shipping",
    answer:
      "Processing and shipping averages 7–10 business days.",
    category: "Shipping",
  },
  {
    question: "Incorrect Addresses",
    answer:
      "Customers are responsible for providing the correct shipping address and for any additional reshipping fees.",
    category: "Shipping",
  },
  {
    question: "Lost or Stolen Packages",
    answer:
      "Once a package has been marked delivered, claims must be made with the shipping carrier. RR Lux Extensions will gladly assist where possible.",
    category: "Shipping",
  },
  {
    question: "Hair Care",
    answer:
      "Use sulfate-free products, detangle gently, use a heat protectant, and have chemical services performed professionally.",
    category: "Hair Care",
  },
  {
    question: "Professional Installation",
    answer:
      "Professional installation is strongly recommended.",
    category: "Hair Care",
  },
  {
    question: "Color Disclaimer",
    answer:
      "Screen settings may slightly affect the color displayed on your device.",
    category: "Hair Care",
  },
];

export default function PoliciesPage() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All");

  const [search, setSearch] = useState("");

  const [openPolicy, setOpenPolicy] =
    useState<string | null>(null);

  const filteredPolicies = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return policies.filter((policy) => {
      const matchesCategory =
        activeCategory === "All" ||
        policy.category === activeCategory;

      const matchesSearch =
        !searchTerm ||
        policy.question.toLowerCase().includes(searchTerm) ||
        policy.answer.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  function handleCategoryChange(category: Category) {
    setActiveCategory(category);
    setOpenPolicy(null);
  }

  function togglePolicy(question: string) {
    setOpenPolicy((current) =>
      current === question ? null : question
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1050px] px-6 pb-28 pt-20 sm:px-8 lg:px-10">
        {/* PAGE TITLE */}
        <div className="text-center">
          <h1 className="font-sans text-[34px] font-medium tracking-[-0.02em] text-black sm:text-[42px]">
            Store Policies
          </h1>

          <p className="mx-auto mt-4 max-w-[620px] font-sans text-[14px] leading-6 text-[#555555] sm:text-[15px]">
            Review our store policies before placing your order.
          </p>
        </div>

        {/* CATEGORY TABS */}
        <div className="mt-16 border-b border-[#E6E6E6]">
          <div className="flex flex-wrap items-center gap-x-14 gap-y-4">
            {categories.map((category) => {
              const isActive =
                activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(category)
                  }
                  className={`relative pb-5 font-sans text-[13px] font-normal transition ${
                    isActive
                      ? "text-black"
                      : "text-[#333333] hover:text-black"
                  }`}
                >
                  {category}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-[50px] bg-[#C9C9C9]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-12">
          <div className="relative w-full max-w-[280px]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Looking for something?"
              className="h-[48px] w-full border-0 border-b border-[#8A8A8A] bg-transparent pr-10 font-sans text-[14px] text-black outline-none placeholder:text-[#222222] focus:border-black"
            />

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute right-0 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-black"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />

              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* POLICIES */}
        <div className="mt-14 border-t border-[#D8D8D8]">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy) => {
              const isOpen =
                openPolicy === policy.question;

              return (
                <div
                  key={policy.question}
                  className="border-b border-[#D8D8D8]"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      togglePolicy(policy.question)
                    }
                    className="flex min-h-[96px] w-full items-center justify-between gap-8 py-7 text-left"
                  >
                    <span className="font-sans text-[16px] font-normal text-black sm:text-[17px]">
                      {policy.question}
                    </span>

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`h-[18px] w-[18px] shrink-0 text-black transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M5 8.5L12 15.5L19 8.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* DROPDOWN ANSWER */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[800px] pb-8 pr-10 font-sans text-[14px] leading-[1.8] text-[#444444] sm:text-[15px]">
                        {policy.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="font-sans text-[15px] text-[#555555]">
                No policies found.
              </p>
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div className="mt-16 border-t border-[#D8D8D8] pt-12">
          <h2 className="font-sans text-[18px] font-medium text-black">
            Contact
          </h2>

          <p className="mt-3 max-w-[650px] font-sans text-[14px] leading-7 text-[#555555]">
            Questions are always welcome. We strive to
            provide excellent customer service.
          </p>
        </div>
      </section>
    </main>
  );
}