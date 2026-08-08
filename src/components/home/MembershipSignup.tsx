"use client";

import { FormEvent, useState } from "react";

export function MembershipSignup() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length !== 10) {
    setSubmitted(false);
    alert("Please enter a complete 10-digit phone number.");
    return;
  }

  if (!email.trim()) {
    setSubmitted(false);
    return;
  }

  setSubmitted(true);
}

  return (
  <section className="relative flex w-full justify-center overflow-hidden bg-[linear-gradient(180deg,#FFFDFC_0%,#FFF9F5_12%,#F8F0EC_26%,#EEDFD8_42%,#D8BFB2_60%,#B98F7E_78%,#8B5E50_100%)] text-white">

      <div className="relative w-full max-w-[1100px] px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* TITLE */}
        <div className="flex w-full flex-col items-center text-center">
          <h2 className="m-0 max-w-[900px] font-sans text-center text-[34px] font-bold uppercase leading-[1.1] tracking-[-0.01em] !text-[#3A211A] sm:text-[44px] lg:text-[50px]">
            The Looks Don&apos;t Stop Here.
          </h2>

          <p className="mt-6 font-sans text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-[#F1E4DD] sm:text-[14px]">
            Stay updated on limited drops &amp; exclusive sales.
          </p>
        </div>

        {/* FORM */}
<div className="mt-12 flex w-full justify-center sm:mt-14">
  <form
    className="w-full max-w-[760px] font-sans"
    onSubmit={handleSubmit}
  >
    {/* PHONE */}
    <div className="w-full">
      <label
        className="block text-[14px] font-semibold text-[#3A211A]"
        htmlFor="membership-phone"
      >
        Phone
      </label>

      <div className="mt-3 flex h-[46px] w-full items-center border-b border-[#8B5E50]">
        <div className="flex shrink-0 items-center gap-1 text-[#5C382E]">
          {/* GLOBE */}
          <svg
            aria-hidden="true"
            className="h-[18px] w-[18px]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            <path
              d="M4.5 9H19.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            <path
              d="M4.5 15H19.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            <path
              d="M12 4C14 6.1 15 8.8 15 12C15 15.2 14 17.9 12 20"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            <path
              d="M12 4C10 6.1 9 8.8 9 12C9 15.2 10 17.9 12 20"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>

          {/* DOWN ARROW */}
          <svg
            aria-hidden="true"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
            />
          </svg>
        </div>

  <input
  className="h-full w-full border-0 bg-transparent px-3 font-sans text-[15px] text-[#3A211A] outline-none placeholder:text-[#8B6F64]"
  id="membership-phone"
  inputMode="numeric"
  maxLength={14}
  placeholder="(555) 555-5555"
  type="tel"
  value={phone}
  onChange={(event) => {
    const digits = event.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    let formatted = "";

    if (digits.length <= 3) {
      formatted = digits.length > 0 ? `(${digits}` : "";
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(
        3,
        6
      )}-${digits.slice(6, 10)}`;
    }

    setPhone(formatted);
    setSubmitted(false);
  }}
/>
      </div>
    </div>

    {/* EMAIL + BUTTON */}
    <div className="mt-9 flex w-full flex-col gap-5 sm:flex-row sm:items-end">
      {/* EMAIL */}
      <div className="min-w-0 flex-1">
        <label
          className="sr-only"
          htmlFor="membership-email"
        >
          Email Address
        </label>

        <input
          required
          className="h-[52px] w-full border-0 border-b border-[#8B5E50] bg-transparent px-3 font-sans text-[15px] text-[#3A211A] outline-none placeholder:text-[#5C382E] focus:border-[#3A211A]"
          id="membership-email"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSubmitted(false);
          }}
        />
      </div>

      {/* BUTTON */}
      <button
        className="mx-auto flex min-h-[60px] w-[170px] shrink-0 items-center justify-center rounded-[8px] border border-[#3A211A] bg-[#FFF9F5] px-4 text-center font-sans text-[14px] font-bold uppercase leading-[1.25] tracking-[0.02em] text-[#3A211A] transition duration-200 hover:bg-[#3A211A] hover:text-[#FFF9F5] sm:mx-0"
        type="submit"
      >
        <span>
          Request
          <br />
          Membership
        </span>
      </button>
    </div>

    {/* SUCCESS MESSAGE */}
    {submitted && (
      <p className="mt-6 text-center font-sans text-sm font-medium text-[#3A211A]">
        Thank you! Your membership request has been received.
      </p>
    )}
  </form>
</div>
        
      </div>
    </section>
  );
}