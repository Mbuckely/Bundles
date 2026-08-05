"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/data/textureProducts";
import {
  CART_UPDATED_EVENT,
  getCartItems,
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

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-black sm:px-6 lg:px-10">
      <section className="mx-auto w-full max-w-5xl">
        <h1 className="text-4xl font-medium tracking-normal">Cart</h1>

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-[#555]">Your cart is empty.</p>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-[#D7D7D7] border-y border-[#D7D7D7]">
              {items.map((item) => (
                <li
                  className="grid gap-4 py-5 sm:grid-cols-[96px_1fr_auto] sm:items-center"
                  key={item.variantId}
                >
                  <div className="relative h-24 w-24 bg-white">
                    <Image
                      alt={`${item.textureName} cart item`}
                      className="object-contain"
                      fill
                      sizes="96px"
                      src={item.image}
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-medium">
                      {item.textureName}
                    </h2>
                    <p className="mt-1 text-sm text-[#555]">
                      {item.length} / {item.bundleLabel}
                    </p>
                    <p className="mt-1 text-sm text-[#555]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="text-base font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-[#D7D7D7] p-5">
              <h2 className="text-lg font-medium">Order Summary</h2>
              <div className="mt-5 flex items-center justify-between border-t border-[#D7D7D7] pt-5">
                <span className="text-sm text-[#555]">Total</span>
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
