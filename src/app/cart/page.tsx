"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/data/textureProducts";
import {
  CART_UPDATED_EVENT,
  getCartItems,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

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

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-black sm:px-6 lg:px-10">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-medium tracking-normal">Cart</h1>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-[#555]">Your cart is empty.</p>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-[#D7D7D7] border-y border-[#D7D7D7]">
              {items.map((item) => (
                <li
                  className="grid gap-5 py-6 sm:grid-cols-[112px_minmax(0,1fr)] lg:grid-cols-[112px_minmax(0,1fr)_180px] lg:items-center"
                  key={item.variantId}
                >
                  <div className="relative h-28 w-28 bg-white">
                    <Image
                      alt={`${item.textureName} cart item`}
                      className="object-contain"
                      fill
                      sizes="112px"
                      src={item.image}
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-medium">
                      {item.textureName}
                    </h2>
                    <div className="mt-2 grid gap-1 text-sm text-[#555]">
                      <p>
                        <span className="font-medium text-black">
                          Length:
                        </span>{" "}
                        {item.length}
                      </p>
                      <p>
                        <span className="font-medium text-black">
                          Bundle:
                        </span>{" "}
                        {item.bundleLabel}
                      </p>
                    </div>

                    <div className="mt-5">
                      <span className="mb-2 block text-sm font-medium text-black">
                        Quantity
                      </span>
                      <div className="flex min-h-[50px] w-40 items-center justify-between rounded-full border border-[#BDBDBD] bg-white px-1">
                        <button
                          aria-label={`Decrease ${item.textureName} quantity`}
                          className="grid h-10 w-10 place-items-center rounded-full text-lg text-black transition hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:text-[#999]"
                          disabled={item.quantity === 1}
                          type="button"
                          onClick={() => decreaseQuantity(item)}
                        >
                          -
                        </button>
                        <input
                          aria-label={`${item.textureName} quantity`}
                          className="h-[48px] w-12 border-0 bg-transparent text-center text-sm font-medium text-black outline-none"
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
                          className="grid h-10 w-10 place-items-center rounded-full text-lg text-black transition hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:text-[#999]"
                          disabled={item.quantity === 10}
                          type="button"
                          onClick={() => increaseQuantity(item)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555]">
                      Estimated total
                    </p>
                    <p className="mt-1 text-xl font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="mt-1 text-xs text-[#555]">
                      Package price: {formatPrice(item.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-[#D7D7D7] p-5">
              <h2 className="text-lg font-medium">Order Summary</h2>
              <div className="mt-5 flex items-center justify-between border-t border-[#D7D7D7] pt-5">
                <span className="text-sm text-[#555]">Estimated total</span>
                <span className="text-xl font-medium">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
