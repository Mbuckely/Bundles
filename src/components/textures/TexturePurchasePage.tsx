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

export function TexturePurchasePage({ product }: TexturePurchasePageProps) {
  const router = useRouter();
  const [selectedLength, setSelectedLength] = useState(pricing[0].length);
  const [selectedBundle, setSelectedBundle] =
    useState<BundleOption>("oneBundle");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [purchaseAction, setPurchaseAction] =
    useState<PurchaseAction>("idle");
  const [cartMessage, setCartMessage] = useState("");

  const packagePrice = useMemo(
    () => getSelectedPrice(selectedLength, selectedBundle),
    [selectedBundle, selectedLength],
  );

  const packagePriceLabel = formatPrice(packagePrice);
  const selectedBundleLabel = bundleLabels[selectedBundle];

  const variantId = useMemo(
    () =>
      createVariantId(
        product.slug,
        selectedLength,
        selectedBundle,
      ),
    [product.slug, selectedBundle, selectedLength],
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

  function handleLengthChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedLength(event.target.value);
    setCartMessage("");
  }

  function handleBundleChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedBundle(event.target.value as BundleOption);
    setCartMessage("");
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
    setCartMessage("");
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(10, current + 1));
    setCartMessage("");
  }

  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuantity = Number(event.target.value);
    const safeQuantity = Number.isFinite(nextQuantity) ? nextQuantity : 1;

    setQuantity(Math.max(1, Math.min(10, Math.floor(safeQuantity))));
    setCartMessage("");
  }

  function handleAddToCart() {
    setPurchaseAction("cart");
    addSelectedItemToCart();
    setCartMessage(
      `${quantity} ${quantity === 1 ? "set" : "sets"} of ${selectedLength} ${selectedBundleLabel} ${product.name} added to cart.`,
    );
    setPurchaseAction("idle");
  }

  function handleBuyNow() {
    setPurchaseAction("buy");
    addSelectedItemToCart();
    setCartMessage("Added to cart. Taking you to checkout.");
    router.push("/cart");
  }

  const isProcessing = purchaseAction !== "idle";

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto grid w-full max-w-[1500px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)] lg:gap-12 lg:px-10 lg:py-14 xl:px-14">
        <section
          aria-label={`${product.name} image gallery`}
          className="grid gap-4 lg:grid-cols-[78px_minmax(0,1fr)] lg:items-start"
        >
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
            {product.images.map((image, index) => {
              const isSelected = selectedImage === image;

              return (
                <button
                  aria-current={isSelected ? "true" : undefined}
                  aria-label={`Show ${product.name} image ${index + 1}`}
                  aria-pressed={isSelected}
                  className={`relative h-20 w-20 shrink-0 bg-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                    isSelected
                      ? "border border-black"
                      : "border border-[#D7D7D7] hover:border-black"
                  }`}
                  key={image}
                  type="button"
                  onClick={() => {
                    setSelectedImage(image);
                  }}
                >
                  <Image
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="object-contain p-1"
                    fill
                    sizes="80px"
                    src={image}
                  />
                </button>
              );
            })}
          </div>

          <div className="relative order-1 min-h-[430px] bg-white lg:order-2 lg:min-h-[720px]">
            <Image
              alt={`${product.name} hair extensions`}
              className="object-contain"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              src={selectedImage}
            />
          </div>
        </section>

        <article className="lg:pt-3">
          <h1 className="font-body text-3xl font-medium leading-tight tracking-normal text-black sm:text-4xl">
            {product.name}
          </h1>

          <div aria-live="polite" className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#555]">
              Package price
            </p>
            <p className="mt-1 text-2xl font-medium text-black">
              {packagePriceLabel}
            </p>
            <p className="mt-1 text-sm text-[#555]">
              {selectedLength} / {selectedBundleLabel}
            </p>
          </div>

          <p className="mt-2 text-sm font-medium text-[#4B4B4B]">
            Bundle pricing available
          </p>

          <p className="mt-1 text-sm text-[#555]">
            Free shipping on orders over $150.
          </p>

          <p className="mt-6 max-w-xl text-sm leading-7 text-[#333]">
            {product.description}
          </p>

          <div className="mt-8 grid gap-5">
            <label className="block" htmlFor="length">
              <span className="mb-2 block text-sm font-medium text-black">
                Length: {selectedLength}
              </span>
              <span className="relative block">
                <select
                  className="h-13 min-h-[50px] w-full appearance-none border border-[#BDBDBD] bg-white px-4 pr-10 text-sm text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  id="length"
                  name="length"
                  value={selectedLength}
                  onChange={handleLengthChange}
                >
                  {pricing.map((item) => (
                    <option key={item.length} value={item.length}>
                      {item.length}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black"
                >
                  v
                </span>
              </span>
            </label>

            <label className="block" htmlFor="bundles">
              <span className="mb-2 block text-sm font-medium text-black">
                Bundles: {selectedBundleLabel}
              </span>
              <span className="relative block">
                <select
                  className="h-13 min-h-[50px] w-full appearance-none border border-[#BDBDBD] bg-white px-4 pr-10 text-sm text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  id="bundles"
                  name="bundles"
                  value={selectedBundle}
                  onChange={handleBundleChange}
                >
                  <option value="oneBundle">1 Bundle</option>
                  <option value="twoBundles">2 Bundle Deal</option>
                  <option value="threeBundles">
                    3 Bundle Deal - Best Value
                  </option>
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black"
                >
                  v
                </span>
              </span>
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-black">
                Quantity
              </span>
              <div className="flex min-h-[50px] w-40 items-center justify-between border border-[#BDBDBD] bg-white">
                <button
                  aria-label="Decrease quantity"
                  className="grid h-[48px] w-12 place-items-center text-lg text-black transition hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:text-[#999]"
                  disabled={quantity === 1}
                  type="button"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <input
                  aria-label="Quantity"
                  className="h-[48px] w-12 border-0 bg-transparent text-center text-sm font-medium text-black outline-none"
                  max={10}
                  min={1}
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button
                  aria-label="Increase quantity"
                  className="grid h-[48px] w-12 place-items-center text-lg text-black transition hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:text-[#999]"
                  disabled={quantity === 10}
                  type="button"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div
            aria-live="polite"
            className="mt-8 border-y border-[#D7D7D7] py-4 text-sm text-[#333]"
          >
            <p>
              <span className="font-medium text-black">Selected:</span>{" "}
              {selectedLength} / {selectedBundleLabel} / Quantity {quantity}
            </p>
            <p className="mt-1">
              <span className="font-medium text-black">Package price:</span>{" "}
              {packagePriceLabel}
            </p>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2">
            <button
              className="min-h-12 rounded-full bg-black px-8 text-sm font-medium text-white transition hover:bg-[#303030] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isProcessing}
              type="button"
              onClick={handleAddToCart}
            >
              {purchaseAction === "cart" ? "Adding..." : "Add to Cart"}
            </button>

            <button
              className="min-h-12 rounded-full border border-black bg-white px-8 text-sm font-medium text-black transition hover:bg-[#F4F4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isProcessing}
              type="button"
              onClick={handleBuyNow}
            >
              {purchaseAction === "buy" ? "Opening Cart..." : "Buy Now"}
            </button>
          </div>

          <p
            aria-live="polite"
            className="mt-4 min-h-6 text-sm font-medium text-[#333]"
          >
            {cartMessage}
          </p>
        </article>
      </section>
    </main>
  );
}
