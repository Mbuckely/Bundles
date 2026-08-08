"use client";

import { useMemo, useState } from "react";

type Category = "All" | "Ordering" | "Hair Care" | "Shipping";

type FAQ = {
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

const faqs: FAQ[] = [
  {
    question: "How many bundles do I need?",
    answer:
      '2 bundles for natural fullness, 3 bundles recommended for a full install, and 4 bundles for extra fullness or lengths 24"+.',
    category: "Ordering",
  },
  {
    question: "Are sales final?",
    answer:
      "Yes. All sales are final due to hygiene.",
    category: "Ordering",
  },
  {
    question: "Do I need a consultation?",
    answer:
      "A consultation is recommended if you are unsure of texture, length, or quantity.",
    category: "Ordering",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders ship within 7–10 business days. Tracking information is emailed once your order has shipped.",
    category: "Shipping",
  },
  {
    question: "How do I wash my extensions?",
    answer:
      "Detangle first, use sulfate-free shampoo, wash downward, condition, rinse thoroughly, and air dry or blow dry with a heat protectant.",
    category: "Hair Care",
  },
  {
    question: "Why choose textured hair?",
    answer:
      "Textured hair blends naturally with textured hair, requires less manipulation, and provides realistic volume.",
    category: "Hair Care",
  },
  {
    question: "What is the difference between textured and non-textured hair?",
    answer:
      "Textured hair blends with natural textures. Straight hair offers a sleek, polished finish.",
    category: "Hair Care",
  },
  {
    question: "Can I color the hair?",
    answer:
      "Yes. We recommend having the hair colored by a licensed professional.",
    category: "Hair Care",
  },
  {
    question: "Can I use heat?",
    answer:
      "Yes. Always use a heat protectant and avoid excessive daily heat.",
    category: "Hair Care",
  },
  {
    question: "How long does the hair last?",
    answer:
      "The hair can last 12 months or longer with proper care.",
    category: "Hair Care",
  },
  {
    question: "Can the hair be reused?",
    answer:
      "Yes. The hair can be reused with proper maintenance and care.",
    category: "Hair Care",
  },
  {
    question: "How should I store my extensions?",
    answer:
      "Store the hair clean, dry, and brushed in a satin or silk bag.",
    category: "Hair Care",
  },
  {
    question: "Is professional installation recommended?",
    answer:
      "Yes. Professional installation is recommended for the best results.",
    category: "Hair Care",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All");

  const [search, setSearch] = useState("");

  const [openFAQ, setOpenFAQ] =
    useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" ||
        faq.category === activeCategory;

      const matchesSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  function handleCategoryChange(category: Category) {
    setActiveCategory(category);
    setOpenFAQ(null);
  }

  function toggleFAQ(question: string) {
    setOpenFAQ((current) =>
      current === question ? null : question
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto w-full max-w-[1050px] px-6 pb-28 pt-20 sm:px-8 lg:px-10">
        {/* PAGE TITLE */}
        <div className="text-center">
          <h1 className="font-sans text-[34px] font-medium tracking-[-0.02em] text-black sm:text-[42px]">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-4 max-w-[620px] font-sans text-[14px] leading-6 text-[#555555] sm:text-[15px]">
            Find answers to common questions about ordering,
            shipping, installation, and caring for your extensions.
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

        {/* FAQ ACCORDIONS */}
        <div className="mt-14 border-t border-[#D8D8D8]">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen =
                openFAQ === faq.question;

              return (
                <div
                  key={faq.question}
                  className="border-b border-[#D8D8D8]"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      toggleFAQ(faq.question)
                    }
                    className="flex min-h-[96px] w-full items-center justify-between gap-8 py-7 text-left"
                  >
                    <span className="font-sans text-[16px] font-normal text-black sm:text-[17px]">
                      {faq.question}
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
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="font-sans text-[15px] text-[#555555]">
                No FAQs found.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}