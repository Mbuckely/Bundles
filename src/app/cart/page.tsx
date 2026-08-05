"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  CART_UPDATED_EVENT,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

type PromoStatus = "idle" | "checking" | "invalid" | "applied";

type PromoResponse = {
  valid?: boolean;
  discountPercent?: number;
};

function formatCartPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M5.5 3.5V2.75h5V3.5m-7 .75h9M4.5 5.5l.4 7.75h6.2l.4-7.75M6.75 7v4.5M9.25 7v4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M2.75 8.25 7.75 3.25h5v5l-5 5-5-5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1"
      />
      <circle cx="10.75" cy="5.5" r=".65" fill="currentColor" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M4.25 2.75h5l2.5 2.5v8h-7.5v-10.5Zm5 0v2.5h2.5"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.2 13.1c0-2.4 2-3.5 2.1-3.6-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.2-2.8.8-3.6.8-.7 0-1.9-.8-3.1-.7-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.8 2.4 3 2.3 1.2 0 1.7-.7 3.1-.7s1.9.7 3.1.7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0-.1-2.6-1-2.7-3.8ZM15 6.1c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.7-1.3Z" />
    </svg>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<PromoStatus>("idle");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    function syncCartItems() {
      setItems(getCartItems());
    }

    syncCartItems();
    window.addEventListener(CART_UPDATED_EVENT, syncCartItems);
    window.addEventListener("storage", syncCartItems);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCartItems);
      window.removeEventListener("storage", syncCartItems);
    };
  }, []);

  const cartTotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [items],
  );
  const hasPromoCode = promoCode.trim().length > 0;
  const discountAmount = cartTotal * (discountPercent / 100);
  const estimatedTotal = Math.max(0, cartTotal - discountAmount);

  function updateQuantity(variantId: string, quantity: number) {
    setItems(updateCartItemQuantity(variantId, quantity));
  }

  function decreaseQuantity(item: CartItem) {
    updateQuantity(item.variantId, item.quantity - 1);
  }

  function increaseQuantity(item: CartItem) {
    updateQuantity(item.variantId, item.quantity + 1);
  }

  function handleQuantityChange(
    event: ChangeEvent<HTMLInputElement>,
    item: CartItem,
  ) {
    const nextQuantity = Number(event.target.value);
    const safeQuantity = Number.isFinite(nextQuantity) ? nextQuantity : 1;

    updateQuantity(item.variantId, safeQuantity);
  }

  function handleRemoveItem(variantId: string) {
    setItems(removeCartItem(variantId));
  }

  function handlePromoCodeChange(event: ChangeEvent<HTMLInputElement>) {
    setPromoCode(event.target.value);
    setPromoStatus("idle");
    setDiscountPercent(0);
  }

  async function handlePromoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasPromoCode || promoStatus === "checking") {
      return;
    }

    setPromoStatus("checking");

    try {
      const response = await fetch("/api/promo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = (await response.json()) as PromoResponse;
      const nextDiscountPercent =
        typeof data.discountPercent === "number" ? data.discountPercent : 0;

      if (!response.ok || !data.valid || nextDiscountPercent <= 0) {
        setPromoStatus("invalid");
        setDiscountPercent(0);
        return;
      }

      setPromoStatus("applied");
      setDiscountPercent(nextDiscountPercent);
    } catch {
      setPromoStatus("invalid");
      setDiscountPercent(0);
    }
  }

  return (
    <main className="cart-page min-h-screen bg-white pb-20 pt-20 text-black md:pt-24">
      <section className="cart-page-frame">
        <h1 className="font-body text-[22px] font-normal leading-7 text-[#222]">
          My cart
        </h1>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-[#555]">Your cart is empty.</p>
        ) : (
          <div className="cart-page-layout mt-5">
            <div>
              <ul className="divide-y divide-[#D0D0D0] border-y border-[#D0D0D0]">
                {items.map((item) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <li
                      className="cart-item-row py-5"
                      key={item.variantId}
                    >
                      <div className="relative h-[70px] w-[104px] border border-[#D5D5D5] bg-white">
                        <Image
                          alt={`${item.textureName} cart item`}
                          className="object-contain p-1"
                          fill
                          sizes="104px"
                          src={item.image}
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-body text-[17px] font-normal leading-5 text-[#222]">
                          {item.textureName}
                        </h2>
                        <p className="mt-3 text-[15px] leading-5 text-[#222]">
                          {formatCartPrice(item.price)}
                        </p>
                        <div className="mt-2 grid gap-1 text-[15px] leading-5 text-[#222]">
                          <p>Length: {item.length}</p>
                          <p>Bundle: {item.bundleLabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-8 sm:col-start-2 sm:justify-start lg:col-start-auto lg:justify-end">
                        <div className="flex h-[30px] w-20 items-center justify-between border border-[#777] bg-white">
                          <button
                            aria-label={`Decrease ${item.textureName} quantity`}
                            className="grid h-7 w-6 place-items-center text-lg leading-none text-[#B8B8B8] transition hover:text-black disabled:cursor-not-allowed disabled:text-[#D7D7D7]"
                            disabled={item.quantity === 1}
                            type="button"
                            onClick={() => decreaseQuantity(item)}
                          >
                            -
                          </button>
                          <input
                            aria-label={`${item.textureName} quantity`}
                            className="h-7 w-7 border-0 bg-transparent text-center text-[13px] leading-none text-black outline-none"
                            max={10}
                            min={1}
                            type="number"
                            value={item.quantity}
                            onChange={(event) =>
                              handleQuantityChange(event, item)
                            }
                          />
                          <button
                            aria-label={`Increase ${item.textureName} quantity`}
                            className="grid h-7 w-6 place-items-center text-lg leading-none text-[#555] transition hover:text-black disabled:cursor-not-allowed disabled:text-[#D7D7D7]"
                            disabled={item.quantity === 10}
                            type="button"
                            onClick={() => increaseQuantity(item)}
                          >
                            +
                          </button>
                        </div>
                        <p className="min-w-[88px] text-right text-[16px] leading-6 text-[#222]">
                          {formatCartPrice(itemTotal)}
                        </p>
                      </div>

                      <button
                        aria-label={`Remove ${item.textureName} from cart`}
                        className="justify-self-end text-black transition hover:text-[#555] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        type="button"
                        onClick={() => handleRemoveItem(item.variantId)}
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 grid gap-4 text-[16px] text-[#8C765F]">
                <form className="grid gap-3" onSubmit={handlePromoSubmit}>
                  <label
                    className="flex items-center gap-3"
                    htmlFor="cart-page-promo-code"
                  >
                    <TagIcon />
                    <input
                      aria-label="Promo code"
                      className="min-w-0 flex-1 border-0 bg-transparent text-black outline-none placeholder:text-[#8C765F] focus-visible:outline-none"
                      id="cart-page-promo-code"
                      placeholder="Enter a promo code"
                      type="text"
                      value={promoCode}
                      onChange={handlePromoCodeChange}
                    />
                  </label>

                  {hasPromoCode ? (
                    <button
                      className="min-h-10 w-fit rounded-full border border-black bg-black px-8 text-[15px] font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:border-[#BDBDBD] disabled:bg-[#BDBDBD]"
                      disabled={promoStatus === "checking"}
                      type="submit"
                    >
                      {promoStatus === "checking" ? "Checking..." : "Enter"}
                    </button>
                  ) : null}

                  <div aria-live="polite" className="min-h-5">
                    {promoStatus === "invalid" ? (
                      <p className="text-sm font-medium text-[#B00020]">
                        Invalid code
                      </p>
                    ) : null}
                    {promoStatus === "applied" ? (
                      <p className="text-sm font-medium text-[#2F6F3E]">
                        Promo code applied
                      </p>
                    ) : null}
                  </div>
                </form>

                <div className="grid gap-3">
                  <button
                    className="flex w-fit items-center gap-3 text-left transition hover:text-black"
                    type="button"
                    onClick={() => setIsNoteOpen((open) => !open)}
                  >
                    <NoteIcon />
                    Add a note
                  </button>
                  {isNoteOpen ? (
                    <textarea
                      aria-label="Order note"
                      className="min-h-24 w-full border border-[#D0D0D0] p-3 text-sm text-black outline-none focus-visible:border-black"
                      placeholder="Add a note for this order"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="h-fit">
              <h2 className="font-body text-[22px] font-normal leading-7 text-[#222]">
                Order summary
              </h2>

              <div className="mt-5 border-t border-[#D0D0D0] pt-5">
                <div className="flex items-center justify-between text-[16px] text-[#222]">
                  <span>Subtotal</span>
                  <span>{formatCartPrice(cartTotal)}</span>
                </div>

                {discountPercent > 0 ? (
                  <div className="mt-4 flex items-center justify-between text-sm text-[#4D3027]">
                    <span>Promo discount</span>
                    <span>-{formatCartPrice(discountAmount)}</span>
                  </div>
                ) : null}

                <div className="mt-5 flex items-center justify-between text-[16px] text-[#222]">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>
                <p className="mt-3 text-[15px] leading-5 underline">
                  Texas, United States
                </p>
                <select
                  aria-label="Delivery option"
                  className="mt-3 h-[42px] w-full border border-[#777] bg-white px-4 text-[16px] text-[#222] outline-none"
                  defaultValue="free"
                >
                  <option value="free">Free Shipping - $0.00</option>
                </select>
              </div>

              <div className="mt-5 border-t border-[#D0D0D0] pt-5">
                <div className="flex items-center justify-between text-[22px] leading-7 text-[#222]">
                  <span>Total</span>
                  <span>{formatCartPrice(estimatedTotal)}</span>
                </div>
                <p className="mt-4 text-[13px] text-[#222]">Tax included</p>
              </div>

              <div className="mt-5 grid gap-3">
                <Link
                  className="cart-checkout-button flex min-h-[42px] w-full items-center justify-center bg-black px-6 text-[16px] font-medium text-white transition hover:bg-[#333]"
                  href="/checkout"
                  style={{ color: "#ffffff" }}
                >
                  Checkout
                </Link>
                <button
                  className="flex min-h-[42px] w-full items-center justify-center gap-1 rounded bg-black px-6 text-[18px] font-semibold text-white transition hover:bg-[#333]"
                  type="button"
                >
                  <AppleIcon />
                  Pay
                </button>
                <button
                  className="min-h-[42px] w-full rounded bg-[#FFC439] px-6 text-[15px] font-medium text-black transition hover:bg-[#F2BA36]"
                  type="button"
                >
                  <span className="font-bold italic text-[#003087]">
                    PayPal
                  </span>{" "}
                  Checkout
                </button>
              </div>

              <button
                className="mt-2 w-full text-center text-[13px] text-[#555] transition hover:text-black"
                type="button"
              >
                More Payment Options v
              </button>

              <p className="mt-4 text-center text-[14px] text-black">
                Secure Checkout
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
