import {
  bundleCounts,
  bundleLabels,
  type BundleCount,
  type BundleOption,
} from "@/data/textureProducts";

export const CART_STORAGE_KEY = "rrlux-cart-items";
export const CART_UPDATED_EVENT = "rrlux-cart-updated";

export type CartItem = {
  id: string;
  variantId: string;
  textureName: string;
  textureSlug: string;
  length: string;
  bundleOption: BundleOption;
  bundleLabel: string;
  bundleCount: BundleCount;
  price: number;
  image: string;
  quantity: number;
};

type StoredCartItem = Omit<CartItem, "bundleOption" | "bundleLabel"> & {
  bundleOption?: BundleOption;
  bundleLabel?: string;
};

function isBundleOption(value: unknown): value is BundleOption {
  return (
    value === "oneBundle" ||
    value === "twoBundles" ||
    value === "threeBundles"
  );
}

function getBundleOptionFromCount(bundleCount: BundleCount): BundleOption {
  if (bundleCount === 2) {
    return "twoBundles";
  }

  if (bundleCount === 3) {
    return "threeBundles";
  }

  return "oneBundle";
}

function isStoredCartItem(value: unknown): value is StoredCartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.variantId === "string" &&
    typeof item.textureName === "string" &&
    typeof item.textureSlug === "string" &&
    typeof item.length === "string" &&
    (item.bundleOption === undefined || isBundleOption(item.bundleOption)) &&
    (item.bundleLabel === undefined || typeof item.bundleLabel === "string") &&
    (item.bundleCount === 1 || item.bundleCount === 2 || item.bundleCount === 3) &&
    typeof item.price === "number" &&
    typeof item.image === "string" &&
    typeof item.quantity === "number"
  );
}

function normalizeCartItem(item: StoredCartItem): CartItem {
  const bundleOption =
    item.bundleOption ?? getBundleOptionFromCount(item.bundleCount);

  return {
    id: item.id,
    variantId: item.variantId,
    textureName: item.textureName,
    textureSlug: item.textureSlug,
    length: item.length,
    bundleOption,
    bundleLabel: bundleLabels[bundleOption],
    bundleCount: bundleCounts[bundleOption],
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  };
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawItems = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!rawItems) {
    return [];
  }

  try {
    const parsedItems: unknown = JSON.parse(rawItems);

    if (!Array.isArray(parsedItems)) {
      return [];
    }

    return parsedItems.filter(isStoredCartItem).map(normalizeCartItem);
  } catch {
    return [];
  }
}

function saveCartItems(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addCartItem(
  item: Omit<CartItem, "quantity"> & { quantity?: number },
) {
  const cartItems = getCartItems();
  const existingItem = cartItems.find(
    (cartItem) => cartItem.variantId === item.variantId,
  );
  const quantityToAdd = Math.max(1, Math.floor(item.quantity ?? 1));

  const updatedItems = existingItem
    ? cartItems.map((cartItem) =>
        cartItem.variantId === item.variantId
          ? {
              id: item.id,
              variantId: item.variantId,
              textureName: item.textureName,
              textureSlug: item.textureSlug,
              length: item.length,
              bundleOption: item.bundleOption,
              bundleLabel: item.bundleLabel,
              bundleCount: item.bundleCount,
              price: item.price,
              image: item.image,
              quantity: cartItem.quantity + quantityToAdd,
            }
          : cartItem,
      )
    : [...cartItems, { ...item, quantity: quantityToAdd }];

  saveCartItems(updatedItems);

  return updatedItems;
}

export function getCartItemCount() {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}
