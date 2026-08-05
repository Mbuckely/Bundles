"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  CART_UPDATED_EVENT,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

type SideCartProps = {
  isOpen: boolean;
  onClose: () => void;
};

type PromoStatus = "idle" | "checking" | "invalid" | "applied";

type PromoResponse = {
  valid?: boolean;
  discountPercent?: number;
  message?: string;
};

function formatDrawerPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
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
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 12.5 11.5 5H19v7.5L11.5 20 4 12.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

export function SideCart({ isOpen, onClose }: SideCartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<PromoStatus>("idle");
  const [discountPercent, setDiscountPercent] = useState(0);

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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  const cartTotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [items],
  );

  const cartItemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
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
        body: JSON.stringify({
          code: promoCode,
        }),
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

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100] flex h-dvh min-h-screen justify-end bg-black/35"
      id="side-cart"
      role="dialog"
    >
      <button
        aria-label="Close cart"
        className="absolute inset-0 cursor-default"
        type="button"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-dvh min-h-screen w-full max-w-[420px] flex-col bg-white font-body text-black shadow-[-20px_0_40px_rgba(0,0,0,0.18)]">
        <header className="flex min-h-[64px] items-center justify-between bg-black px-6 text-white">
          <h2
            className="text-[22px] font-normal leading-none text-white"
            style={{ color: "#ffffff" }}
          >
            Cart{" "}
            <span
              className="text-base font-normal text-white"
              style={{ color: "#ffffff" }}
            >
              ({cartItemCount} {cartItemCount === 1 ? "item" : "items"})
            </span>
          </h2>
          <button
            aria-label="Close cart"
            className="-mr-2 grid h-10 w-10 place-items-center text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            type="button"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: "32px 32px 24px" }}
        >
          {items.length === 0 ? (
            <p className="mt-8 text-sm text-[#555]">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;

                return (
                  <li
                    className="grid grid-cols-[78px_minmax(0,1fr)_24px] gap-x-4 py-7"
                    key={item.variantId}
                  >
                    <div className="relative h-[52px] w-[78px] border border-[#D2D2D2] bg-white">
                      <Image
                        alt={`${item.textureName} cart item`}
                        className="object-contain p-1"
                        fill
                        sizes="78px"
                        src={item.image}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-[16px] font-normal leading-5">
                        {item.textureName}
                      </h3>

                      <p className="mt-2 text-[15px] leading-5 text-[#222]">
                        {formatDrawerPrice(item.price)}
                      </p>

                      <div className="mt-3 grid gap-2 text-[15px] leading-5 text-[#222]">
                        <p>Length: {item.length}</p>
                        <p>Bundle: {item.bundleLabel}</p>
                      </div>

                      <div className="mt-5 flex items-start justify-between gap-5">
                        <div className="flex h-[34px] w-20 items-center justify-between border border-[#777] bg-white">
                          <button
                            aria-label={`Decrease ${item.textureName} quantity`}
                            className="grid h-8 w-6 place-items-center text-lg leading-none text-[#B8B8B8] transition hover:text-black disabled:cursor-not-allowed disabled:text-[#D7D7D7]"
                            disabled={item.quantity === 1}
                            type="button"
                            onClick={() => decreaseQuantity(item)}
                          >
                            -
                          </button>
                          <input
                            aria-label={`${item.textureName} quantity`}
                            className="h-8 w-7 border-0 bg-transparent text-center text-[16px] leading-none text-black outline-none"
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
                            className="grid h-8 w-6 place-items-center text-[24px] leading-none text-[#555] transition hover:text-black disabled:cursor-not-allowed disabled:text-[#D7D7D7]"
                            disabled={item.quantity === 10}
                            type="button"
                            onClick={() => increaseQuantity(item)}
                          >
                            +
                          </button>
                        </div>

                        <div className="min-w-[90px] text-right text-[16px] leading-6">
                          <p className="text-[#222]">
                            {formatDrawerPrice(itemTotal)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      aria-label={`Remove ${item.textureName} from cart`}
                      className="-mt-1 grid h-8 w-8 place-items-center text-black transition hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      type="button"
                      onClick={() => handleRemoveItem(item.variantId)}
                    >
                      <TrashIcon />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="px-8 pb-5">
          <form
            className="border-t border-[#BDBDBD] pt-4"
            onSubmit={handlePromoSubmit}
          >
            <label
              className="flex min-h-[48px] w-full items-center gap-3 border-b border-[#E7E2DD] pb-4 text-[16px] text-[#8C765F]"
              htmlFor="cart-promo-code"
            >
              <TagIcon />
              <input
                aria-label="Promo code"
                className="min-w-0 flex-1 border-0 bg-transparent text-black outline-none placeholder:text-[#8C765F] focus-visible:outline-none"
                id="cart-promo-code"
                placeholder="Enter a promo code"
                type="text"
                value={promoCode}
                onChange={handlePromoCodeChange}
              />
            </label>

            {hasPromoCode ? (
              <div className="mt-3">
                <button
                  className="min-h-10 w-full rounded-full border border-black bg-black px-5 text-[15px] font-medium text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:border-[#BDBDBD] disabled:bg-[#BDBDBD]"
                  disabled={promoStatus === "checking"}
                  type="submit"
                >
                  {promoStatus === "checking" ? "Checking..." : "Enter"}
                </button>
              </div>
            ) : null}

            <div aria-live="polite" className="min-h-6">
              {promoStatus === "invalid" ? (
                <p className="mt-2 text-sm font-medium text-[#B00020]">
                  Invalid code
                </p>
              ) : null}

              {promoStatus === "applied" ? (
                <p className="mt-2 text-sm font-medium text-[#2F6F3E]">
                  Promo code applied
                </p>
              ) : null}
            </div>
          </form>

          {discountPercent > 0 ? (
            <div className="mt-3 flex items-center justify-between text-sm text-[#4D3027]">
              <span>Promo discount</span>
              <span>-{formatDrawerPrice(discountAmount)}</span>
            </div>
          ) : null}

          <div className="mt-5 flex items-center justify-between text-[22px] leading-7">
            <span>Estimated total</span>
            <span>{formatDrawerPrice(estimatedTotal)}</span>
          </div>

          <Link
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full border border-black bg-white px-6 text-[16px] font-normal text-black transition hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            href="/cart"
            onClick={onClose}
          >
            View Cart
          </Link>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
