"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

import {
  bundleCounts,
  bundleLabels,
  createVariantId,
  formatPrice,
  getSelectedPrice,
  pricing,
  type BundleOption,
  type TextureProduct,
} from "@/data/textureProducts";

import { addCartItem } from "@/lib/cart";

type TexturePurchasePageProps = {
  product: TextureProduct;
};

type PurchaseAction = "idle" | "cart" | "buy";

export function TexturePurchasePage({
  product,
}: TexturePurchasePageProps) {
  const router = useRouter();

  const [selectedLength, setSelectedLength] =
    useState(pricing[0].length);

  const [selectedBundle, setSelectedBundle] =
    useState<BundleOption>("oneBundle");

  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] =
    useState(product.images[0]);

  const [, setPurchaseAction] =
    useState<PurchaseAction>("idle");

  const [cartMessage, setCartMessage] = useState("");

  const packagePrice = useMemo(
    () =>
      getSelectedPrice(
        selectedLength,
        selectedBundle
      ),
    [selectedBundle, selectedLength]
  );

  const packagePriceLabel =
    formatPrice(packagePrice);

  const selectedBundleLabel =
    bundleLabels[selectedBundle];

  const variantId = useMemo(
    () =>
      createVariantId(
        product.slug,
        selectedLength,
        selectedBundle
      ),
    [
      product.slug,
      selectedBundle,
      selectedLength,
    ]
  );

  function addSelectedItemToCart() {
    addCartItem({
      id: variantId,
      variantId,
      textureName: product.name,
      textureSlug: product.slug,
      length: selectedLength,
      bundleCount: bundleCounts[selectedBundle],
      bundleOption: selectedBundle,
      bundleLabel: selectedBundleLabel,
      price: packagePrice,
      image: product.images[0],
      quantity,
    });
  }

  function handleLengthChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedLength(event.target.value);
    setCartMessage("");
  }

  function handleBundleChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedBundle(
      event.target.value as BundleOption
    );

    setCartMessage("");
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );

    setCartMessage("");
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(10, current + 1)
    );

    setCartMessage("");
  }

  function handleQuantityChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextQuantity =
      Number(event.target.value);

    const safeQuantity =
      Number.isFinite(nextQuantity)
        ? nextQuantity
        : 1;

    setQuantity(
      Math.max(
        1,
        Math.min(
          10,
          Math.floor(safeQuantity)
        )
      )
    );

    setCartMessage("");
  }

  function handleAddToCart() {
    setPurchaseAction("cart");

    addSelectedItemToCart();

    setCartMessage(
      `${quantity} ${
        quantity === 1 ? "set" : "sets"
      } of ${selectedLength} ${selectedBundleLabel} ${product.name} added to cart.`
    );

    setPurchaseAction("idle");
  }

  function handleBuyNow() {
    setPurchaseAction("buy");

    addSelectedItemToCart();

    setCartMessage(
      "Added to cart. Taking you to checkout."
    );

    router.push("/cart");
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 pb-16 pt-20 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,560px)_minmax(360px,1fr)] lg:items-start lg:gap-16 lg:px-10 lg:pt-28">
        {/* IMAGE GALLERY */}
        <section
          aria-label={`${product.name} image gallery`}
          className="grid gap-4 lg:grid-cols-[64px_minmax(0,1fr)] lg:items-start"
        >
          {/* THUMBNAILS */}
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
            {product.images.map(
              (image, index) => {
                const isSelected =
                  selectedImage === image;

                return (
                  <button
                    aria-current={
                      isSelected
                        ? "true"
                        : undefined
                    }
                    aria-label={`Show ${product.name} image ${
                      index + 1
                    }`}
                    aria-pressed={isSelected}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden bg-[#FAFAFA] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      isSelected
                        ? "border border-black"
                        : "border border-[#E2E2E2] hover:border-black"
                    }`}
                    key={image}
                    type="button"
                    onClick={() =>
                      setSelectedImage(image)
                    }
                  >
                    <Image
                      alt={`${product.name} thumbnail ${
                        index + 1
                      }`}
                      className="object-contain p-1"
                      fill
                      sizes="64px"
                      src={image}
                    />
                  </button>
                );
              }
            )}
          </div>

          {/* MAIN IMAGE */}
          <div className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[500px] overflow-hidden bg-[#FAFAFA] lg:order-2">
            <Image
              alt={`${product.name} hair extensions`}
              className="object-contain p-4"
              fill
              priority
              sizes="(min-width: 1024px) 500px, 90vw"
              src={selectedImage}
            />
          </div>
        </section>

        {/* PRODUCT INFORMATION */}
        <article className="w-full max-w-[480px] lg:pt-10">
          <h1 className="font-body text-[30px] font-medium leading-tight tracking-normal text-black sm:text-[34px]">
            {product.name}
          </h1>

          {/* PRICE */}
          <div
            aria-live="polite"
            className="mt-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#666666]">
              Package price
            </p>

            <p className="mt-2 text-[22px] font-medium text-black">
              {packagePriceLabel}
            </p>

            <p className="mt-1 text-[13px] text-[#666666]">
              {selectedLength} /{" "}
              {selectedBundleLabel}
            </p>
          </div>

          <p className="mt-3 text-[13px] font-medium text-[#555555]">
            Bundle pricing available
          </p>

          {/* DESCRIPTION */}
          <p className="mt-6 max-w-[460px] text-[14px] leading-7 text-[#444444]">
            {product.description}
          </p>

          {/* OPTIONS */}
          <div className="mt-8 grid gap-6">
            {/* LENGTH */}
            <label
              className="block"
              htmlFor="length"
            >
              <span className="mb-2 block text-[13px] font-medium text-black">
                Length: {selectedLength}
              </span>

              <span className="relative block">
                <select
                  className="min-h-[48px] w-full appearance-none border border-[#CFCFCF] bg-white px-4 pr-10 text-[13px] text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  id="length"
                  name="length"
                  value={selectedLength}
                  onChange={
                    handleLengthChange
                  }
                >
                  {pricing.map((item) => (
                    <option
                      key={item.length}
                      value={item.length}
                    >
                      {item.length}
                    </option>
                  ))}
                </select>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-black"
                >
                  v
                </span>
              </span>
            </label>

            {/* BUNDLES */}
            <label
              className="block"
              htmlFor="bundles"
            >
              <span className="mb-2 block text-[13px] font-medium text-black">
                Bundles:{" "}
                {selectedBundleLabel}
              </span>

              <span className="relative block">
                <select
                  className="min-h-[48px] w-full appearance-none border border-[#CFCFCF] bg-white px-4 pr-10 text-[13px] text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  id="bundles"
                  name="bundles"
                  value={selectedBundle}
                  onChange={
                    handleBundleChange
                  }
                >
                  <option value="oneBundle">
                    1 Bundle
                  </option>

                  <option value="twoBundles">
                    2 Bundle Deal
                  </option>

                  <option value="threeBundles">
                    3 Bundle Deal - Best Value
                  </option>
                </select>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-black"
                >
                  v
                </span>
              </span>
            </label>

            {/* QUANTITY */}
            <div>
              <span className="mb-2 block text-[13px] font-medium text-black">
                Quantity
              </span>

              <div className="flex min-h-[46px] w-36 items-center justify-between rounded-full border border-[#CFCFCF] bg-white px-1">
                <button
                  aria-label="Decrease quantity"
                  className="grid h-9 w-9 place-items-center rounded-full text-lg text-black transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:text-[#AAAAAA]"
                  disabled={
                    quantity === 1
                  }
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                >
                  -
                </button>

                <input
                  aria-label="Quantity"
                  className="h-[44px] w-10 border-0 bg-transparent text-center text-[13px] font-medium text-black outline-none"
                  max={10}
                  min={1}
                  type="number"
                  value={quantity}
                  onChange={
                    handleQuantityChange
                  }
                />

                <button
                  aria-label="Increase quantity"
                  className="grid h-9 w-9 place-items-center rounded-full text-lg text-black transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:text-[#AAAAAA]"
                  disabled={
                    quantity === 10
                  }
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* SELECTED PACKAGE */}
          <div
            aria-live="polite"
            className="mt-10 border-y border-[#D7D7D7] py-4 text-[13px] text-[#444444]"
          >
            <p>
              <span className="font-medium text-black">
                Selected:
              </span>{" "}
              {selectedLength} /{" "}
              {selectedBundleLabel} /
              Quantity {quantity}
            </p>

            <p className="mt-1">
              <span className="font-medium text-black">
                Package price:
              </span>{" "}
              {packagePriceLabel}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <button
              className="min-h-[48px] rounded-full bg-black px-6 text-[13px] font-medium text-white transition hover:bg-[#26130F]"
              type="button"
              onClick={
                handleAddToCart
              }
            >
              Add to Cart
            </button>

            <button
              className="min-h-[48px] rounded-full border border-black bg-white px-6 text-[13px] font-medium text-black transition hover:bg-[#F7F7F7]"
              type="button"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>

          {/* CART MESSAGE */}
          <p
            aria-live="polite"
            className="mt-4 min-h-6 text-[13px] font-medium text-[#444444]"
          >
            {cartMessage}
          </p>
        </article>
      </section>
    </main>
  );
}