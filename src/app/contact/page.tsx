"use client";

import { FormEvent, useState } from "react";

type SubmitState = {
  tone: "idle" | "success" | "error";
  message: string;
};

type ContactResponse = {
  success?: boolean;
  message?: string;
};

const fieldClass =
  "w-full border-0 border-b border-[#26130F]/55 bg-transparent px-0 pb-4 pt-2 text-base text-[#26130F] outline-none transition placeholder:text-[#26130F]/35 focus:border-[#24651D] focus:ring-0";

const labelClass =
  "text-sm font-medium text-[#26130F]";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitState, setSubmitState] = useState<SubmitState>({
    tone: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setSubmitState({
      tone: "idle",
      message: "",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          name: `${formData.get("firstName")} ${formData.get("lastName")}`,
          email: formData.get("email"),
          countryCode: formData.get("countryCode"),
          phone: formData.get("phone"),
          orderNumber: formData.get("orderNumber"),
          message: formData.get("message"),
        }),
      });

      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result.success) {
        setSubmitState({
          tone: "error",
          message:
            result.message ??
            "Your message could not be sent. Please try again.",
        });

        return;
      }

      form.reset();

      setSubmitState({
        tone: "success",
        message:
          result.message ??
          "Thank you. Your message has been sent successfully.",
      });
    } catch {
      setSubmitState({
        tone: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#26130F]">
      {/* Large page banner */}
      <section className="flex min-h-[290px] items-center justify-center bg-[#F7F5F0] px-5 py-16 text-center sm:min-h-[360px] sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-[clamp(4rem,10vw,9rem)] font-semibold uppercase leading-[0.82] tracking-[-0.06em] text-[#24651D]">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact form */}
      <section className="flex justify-center px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto w-full max-w-2xl md:translate-x-16 lg:translate-x-20">
          <div className="w-full max-w-2xl">
            <header className="mb-12 text-center">
              <h2 className="mx-auto max-w-xl text-4xl font-normal leading-tight tracking-[-0.035em] text-black sm:text-5xl">
                Have a question? We are happy to help.
              </h2>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#26130F]/65 sm:text-base">
                Send us a message about our bundles, textures, pricing, or your
                order and we will get back to you.
              </p>
            </header>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-5 w-full max-w-xl space-y-8"
              aria-busy={isSubmitting}
            >
              <label className="block">
                <span className={labelClass}>
                  First name <span aria-hidden="true">*</span>
                </span>

                <input
                  className={fieldClass}
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="block">
                <span className={labelClass}>
                  Last name <span aria-hidden="true">*</span>
                </span>

                <input
                  className={fieldClass}
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                />
              </label>

              <label className="block">
                <span className={labelClass}>
                  Email <span aria-hidden="true">*</span>
                </span>

                <input
                  className={fieldClass}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>

              <div>
                <span className={labelClass}>Phone</span>

                <div className="mt-2 grid grid-cols-[105px_1fr] gap-4 border-b border-[#26130F]/55 pb-4">
                  <label className="sr-only" htmlFor="countryCode">
                    Country code
                  </label>

                  <select
                    id="countryCode"
                    name="countryCode"
                    defaultValue="+1"
                    className="w-full bg-transparent text-sm text-[#26130F] outline-none"
                  >
                    <option value="+1">🌐 +1</option>
                    <option value="+44">🌐 +44</option>
                    <option value="+234">🌐 +234</option>
                    <option value="+233">🌐 +233</option>
                    <option value="+1876">🌐 +1 876</option>
                  </select>

                  <label className="sr-only" htmlFor="phone">
                    Phone number
                  </label>

                  <input
                    id="phone"
                    className="w-full bg-transparent text-base text-[#26130F] outline-none placeholder:text-[#26130F]/35"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <label className="block">
                <span className={labelClass}>Order number </span>

                <input
                  className={fieldClass}
                  name="orderNumber"
                  type="text"
                />
              </label>

              <label className="block">
                <span className={labelClass}>
                  Message <span aria-hidden="true">*</span>
                </span>

                <textarea
                  className="mt-3 min-h-36 w-full resize-y border-0 border-b border-[#26130F]/55 bg-transparent px-0 py-3 text-base leading-7 text-[#26130F] outline-none transition focus:border-[#24651D] focus:ring-0"
                  name="message"
                  required
                />
              </label>

              <div aria-live="polite">
                {submitState.message && (
                  <p
                    role={
                      submitState.tone === "error"
                        ? "alert"
                        : "status"
                    }
                    className={`text-sm font-medium ${
                      submitState.tone === "success"
                        ? "text-[#24651D]"
                        : "text-[#9B2C24]"
                    }`}
                  >
                    {submitState.message}
                  </p>
                )}
              </div>

              <div className="!mt-10 flex w-full justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="contact-submit border-none bg-transparent p-0 text-sm font-medium text-[#26130F] shadow-none outline-none transition hover:text-[#FFB000] focus:border-none focus:outline-none focus:ring-0 focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 active:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
