"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CART_UPDATED_EVENT,
  getCartItems,
  type CartItem,
} from "@/lib/cart";

const SALES_TAX_RATE = 0.0826;
const GOOGLE_MAPS_SCRIPT_ID = "google-maps-places-script";
const GOOGLE_MAPS_CALLBACK_NAME = "__rrluxGoogleMapsReady";
const SUPPORTED_AUTOCOMPLETE_COUNTRIES = ["us", "ca", "bs"];
const STATE_OPTIONS = [
  { label: "Texas", value: "TX" },
  { label: "Florida", value: "FL" },
  { label: "California", value: "CA" },
  { label: "New York", value: "NY" },
  { label: "Georgia", value: "GA" },
];

type DeliveryAddress = {
  country: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

type GoogleMapsAutocompleteListener = {
  remove: () => void;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlaceResult = {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
};

type GoogleAutocompleteOptions = {
  componentRestrictions?: {
    country: string | string[];
  };
  fields?: string[];
  types?: string[];
};

type GoogleAutocompleteInstance = {
  addListener: (
    eventName: "place_changed",
    handler: () => void,
  ) => GoogleMapsAutocompleteListener;
  getPlace: () => GooglePlaceResult;
};

type GoogleMapsWindow = Window &
  typeof globalThis & {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options: GoogleAutocompleteOptions,
          ) => GoogleAutocompleteInstance;
        };
      };
    };
    __rrluxGoogleMapsReady?: () => void;
  };

let googleMapsPlacesPromise: Promise<void> | null = null;

function formatCheckoutPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function loadGoogleMapsPlaces(apiKey: string) {
  const googleWindow = window as GoogleMapsWindow;

  if (googleWindow.google?.maps?.places?.Autocomplete) {
    return Promise.resolve();
  }

  if (googleMapsPlacesPromise) {
    return googleMapsPlacesPromise;
  }

  googleMapsPlacesPromise = new Promise<void>((resolve, reject) => {
    googleWindow.__rrluxGoogleMapsReady = () => {
      resolve();
    };

    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          googleMapsPlacesPromise = null;
          reject(new Error("Google Maps failed to load."));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    const params = new URLSearchParams({
      callback: GOOGLE_MAPS_CALLBACK_NAME,
      key: apiKey,
      libraries: "places",
    });

    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      googleMapsPlacesPromise = null;
      reject(new Error("Google Maps failed to load."));
    };

    document.head.appendChild(script);
  });

  return googleMapsPlacesPromise;
}

function getAddressComponent(
  components: GoogleAddressComponent[],
  type: string,
  useShortName = false,
) {
  const component = components.find((item) => item.types.includes(type));

  if (!component) {
    return "";
  }

  return useShortName ? component.short_name : component.long_name;
}

function mapPlaceToDeliveryAddress(
  place: GooglePlaceResult,
  currentAddress: DeliveryAddress,
): DeliveryAddress {
  const components = place.address_components ?? [];
  const streetNumber = getAddressComponent(components, "street_number");
  const route = getAddressComponent(components, "route");
  const postalCode = getAddressComponent(components, "postal_code");
  const postalCodeSuffix = getAddressComponent(
    components,
    "postal_code_suffix",
  );
  const city =
    getAddressComponent(components, "locality") ||
    getAddressComponent(components, "postal_town") ||
    getAddressComponent(components, "sublocality_level_1") ||
    getAddressComponent(components, "administrative_area_level_2");
  const formattedStreet =
    [streetNumber, route].filter(Boolean).join(" ") ||
    place.formatted_address?.split(",")[0] ||
    currentAddress.address;
  const formattedPostalCode = [postalCode, postalCodeSuffix]
    .filter(Boolean)
    .join("-");

  return {
    ...currentAddress,
    address: formattedStreet,
    city: city || currentAddress.city,
    country:
      getAddressComponent(components, "country", true) ||
      currentAddress.country,
    postalCode: formattedPostalCode || currentAddress.postalCode,
    state:
      getAddressComponent(components, "administrative_area_level_1", true) ||
      currentAddress.state,
  };
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.2 13.1c0-2.4 2-3.5 2.1-3.6-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.2-2.8.8-3.6.8-.7 0-1.9-.8-3.1-.7-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.8 2.4 3 2.3 1.2 0 1.7-.7 3.1-.7s1.9.7 3.1.7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0-.1-2.6-1-2.7-3.8ZM15 6.1c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.7-1.3Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 16 16">
      <path
        d="m4.5 6 3.5 3.5L11.5 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 16 16">
      <path
        d="M3.25 12.25 4 9.5 10.8 2.7a1.42 1.42 0 0 1 2 2L6 11.5l-2.75.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 18 18">
      <path
        d="m2.75 9 6.25-6.25h5.25V8L8 14.25 2.75 9Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="5.25" r=".75" fill="currentColor" />
    </svg>
  );
}

function CheckoutField({
  label,
  type = "text",
  required = false,
  autoComplete,
  defaultValue,
  inputRef,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  inputRef?: Ref<HTMLInputElement>;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const valueProps =
    value === undefined ? { defaultValue } : { value, onChange };

  return (
    <label className="grid gap-2 text-[14px] leading-5 text-black">
      <span>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>

      <input
        autoComplete={autoComplete}
        className="h-[42px] w-full rounded-[3px] border border-[#9E9E9E] bg-white px-3 text-[16px] text-black outline-none transition hover:border-black focus:border-2 focus:border-black"
        ref={inputRef}
        required={required}
        type={type}
        {...valueProps}
      />
    </label>
  );
}

function CheckoutSelect({
  label,
  required = false,
  children,
  autoComplete,
  defaultValue = "",
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  autoComplete?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  const valueProps =
    value === undefined ? { defaultValue } : { value, onChange };

  return (
    <label className="grid gap-2 text-[14px] leading-5 text-black">
      <span>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>

      <div className="relative">
        <select
          autoComplete={autoComplete}
          className="h-[42px] w-full appearance-none rounded-[3px] border border-[#9E9E9E] bg-white px-3 pr-11 text-[16px] text-black outline-none transition hover:border-black focus:border-2 focus:border-black"
          required={required}
          {...valueProps}
        >
          {children}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black">
          <ChevronIcon />
        </span>
      </div>
    </label>
  );
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    address: "",
    addressLine2: "",
    city: "",
    country: "US",
    postalCode: "77044",
    state: "TX",
  });
  const addressInputRef = useRef<HTMLInputElement>(null);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
    if (!googleMapsApiKey || !addressInputRef.current) {
      return;
    }

    let autocomplete: GoogleAutocompleteInstance | null = null;
    let listener: GoogleMapsAutocompleteListener | null = null;
    let isMounted = true;

    loadGoogleMapsPlaces(googleMapsApiKey)
      .then(() => {
        const googleWindow = window as GoogleMapsWindow;
        const Autocomplete = googleWindow.google?.maps?.places?.Autocomplete;

        if (!isMounted || !addressInputRef.current || !Autocomplete) {
          return;
        }

        autocomplete = new Autocomplete(addressInputRef.current, {
          componentRestrictions: {
            country: SUPPORTED_AUTOCOMPLETE_COUNTRIES,
          },
          fields: ["address_components", "formatted_address"],
          types: ["address"],
        });

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();

          if (!place) {
            return;
          }

          setDeliveryAddress((currentAddress) =>
            mapPlaceToDeliveryAddress(place, currentAddress),
          );
        });
      })
      .catch(() => {
        googleMapsPlacesPromise = null;
      });

    return () => {
      isMounted = false;
      listener?.remove();
    };
  }, [googleMapsApiKey]);

  const cartTotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [items],
  );

  const cartItemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [items],
  );

  const salesTax = cartTotal > 0 ? cartTotal * SALES_TAX_RATE : 0;
  const orderTotal = cartTotal + salesTax;
  const hasSelectedStateOption = STATE_OPTIONS.some(
    (option) => option.value === deliveryAddress.state,
  );

  function updateDeliveryInput(field: keyof DeliveryAddress) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setDeliveryAddress((currentAddress) => ({
        ...currentAddress,
        [field]: event.target.value,
      }));
    };
  }

  function updateDeliverySelect(field: keyof DeliveryAddress) {
    return (event: ChangeEvent<HTMLSelectElement>) => {
      setDeliveryAddress((currentAddress) => ({
        ...currentAddress,
        [field]: event.target.value,
      }));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="checkout-page min-h-screen bg-white text-black">
      <header className="border-b border-[#BDBDBD]">
        <div className="checkout-header-frame flex h-[72px] items-center justify-between">
          <Link className="flex min-w-0 items-center gap-6" href="/">
            <span className="text-[12px] font-bold tracking-[-0.04em] text-[#6B6B6B]">
              RRLUX
            </span>
            <h1 className="font-body text-[21px] font-normal uppercase tracking-[0.16em] text-black">
              Checkout
            </h1>
          </Link>

          <Link
            className="shrink-0 text-[16px] text-black underline underline-offset-2 transition hover:text-[#555]"
            href="/#shop-hair"
          >
            Continue Browsing
          </Link>
        </div>
      </header>

      <div className="checkout-page-frame checkout-page-layout">
        <section className="min-w-0">
          <div className="relative rounded-[4px] border border-[#D5D5D5] px-4 pb-7 pt-7">
            <div className="absolute left-1/2 top-0 bg-white px-3 text-center text-[14px] text-[#333] -translate-x-1/2 -translate-y-1/2">
              Express checkout
            </div>

            <div className="grid gap-3">
              <button
                className="flex h-[42px] items-center justify-center gap-1 rounded-[4px] bg-black px-4 text-[18px] font-semibold text-white transition hover:bg-[#2F2F2F]"
                type="button"
              >
                <AppleIcon />
                Pay
              </button>

              <button
                className="h-[42px] rounded-[4px] bg-[#FFC439] px-4 text-[15px] font-medium text-black transition hover:bg-[#F4BA2D]"
                type="button"
              >
                <span className="font-bold italic text-[#003087]">PayPal</span>{" "}
                Checkout
              </button>

              <button
                className="h-[42px] rounded-[4px] bg-[#FFC439] px-4 text-[15px] font-medium text-black transition hover:bg-[#F4BA2D]"
                type="button"
              >
                <span className="font-bold text-[#003087]">P</span> Pay Later
              </button>

              <button
                className="h-[42px] rounded-[4px] bg-[#118EF3] px-4 text-[16px] font-bold italic text-white transition hover:bg-[#0879D2]"
                type="button"
              >
                venmo <span className="text-sm not-italic">Checkout</span>
              </button>

              <button
                className="flex h-[42px] items-center justify-center gap-3 rounded-[2px] bg-black px-4 text-[14px] text-white transition hover:bg-[#2F2F2F]"
                type="button"
              >
                <span>
                  <span className="font-semibold text-[#4285F4]">G</span> Pay
                </span>
                <span className="grid h-6 w-9 place-items-center rounded-sm bg-[#4D7C31] text-[9px]">
                  Card
                </span>
                <span className="grid h-6 w-9 place-items-center rounded-sm bg-[#B7892B] text-[9px]">
                  Card
                </span>
                <span className="grid h-6 w-8 place-items-center rounded-sm border border-[#777] text-lg leading-none">
                  +
                </span>
              </button>
            </div>

            <span className="absolute bottom-0 left-1/2 bg-white px-3 text-sm text-[#555] -translate-x-1/2 translate-y-1/2">
              or
            </span>
          </div>

          <form className="mt-9 grid gap-8" onSubmit={handleSubmit}>
            <section className="grid gap-5">
              <h2 className="font-body text-[22px] font-semibold leading-7 text-black">
                Customer details
              </h2>

              <CheckoutField
                autoComplete="email"
                label="Email"
                required
                type="email"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <CheckoutField
                  autoComplete="given-name"
                  label="First name"
                  required
                />

                <CheckoutField
                  autoComplete="family-name"
                  label="Last name"
                  required
                />
              </div>

              <CheckoutField
                autoComplete="tel"
                label="Phone"
                required
                type="tel"
              />
            </section>

            <section className="grid gap-5">
              <h2 className="font-body text-[22px] font-semibold leading-7 text-black">
                Delivery details
              </h2>

              <CheckoutSelect
                autoComplete="country-name"
                label="Country/Region"
                required
                value={deliveryAddress.country}
                onChange={updateDeliverySelect("country")}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="BS">Bahamas</option>
              </CheckoutSelect>

              <CheckoutField
                autoComplete="off"
                inputRef={addressInputRef}
                label="Address"
                required
                value={deliveryAddress.address}
                onChange={updateDeliveryInput("address")}
              />

              <CheckoutField
                autoComplete="address-line2"
                label="Address - line 2"
                value={deliveryAddress.addressLine2}
                onChange={updateDeliveryInput("addressLine2")}
              />

              <CheckoutField
                autoComplete="address-level2"
                label="City"
                required
                value={deliveryAddress.city}
                onChange={updateDeliveryInput("city")}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <CheckoutSelect
                  autoComplete="address-level1"
                  label="State"
                  required
                  value={deliveryAddress.state}
                  onChange={updateDeliverySelect("state")}
                >
                  {STATE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  {!hasSelectedStateOption && deliveryAddress.state ? (
                    <option value={deliveryAddress.state}>
                      {deliveryAddress.state}
                    </option>
                  ) : null}
                </CheckoutSelect>

                <CheckoutField
                  autoComplete="postal-code"
                  label="Zip / Postal code"
                  required
                  value={deliveryAddress.postalCode}
                  onChange={updateDeliveryInput("postalCode")}
                />
              </div>

              <button
                className="mt-1 min-h-[48px] w-full rounded-[3px] bg-black px-6 text-[16px] font-medium text-white transition hover:bg-[#2E2E2E]"
                type="submit"
              >
                Continue
              </button>
            </section>

            <section className="mt-2 border-t border-[#BDBDBD]">
              <button
                className="flex min-h-[74px] w-full items-center text-left font-body text-[21px] font-normal text-[#6E6262]"
                type="button"
              >
                Delivery method
              </button>

              <button
                className="flex min-h-[74px] w-full items-center border-t border-[#BDBDBD] text-left font-body text-[21px] font-normal text-[#6E6262]"
                type="button"
              >
                Payment
              </button>
            </section>
          </form>
        </section>

        <aside className="min-w-0 border-l border-[#CFCFCF] pl-8 lg:pl-12">
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center justify-between gap-5">
              <h2 className="font-body text-[20px] font-semibold leading-7 text-black">
                Order summary{" "}
                <span className="font-normal">
                  ({cartItemCount} {cartItemCount === 1 ? "item" : "items"})
                </span>
              </h2>

              <Link
                aria-label="Edit cart"
                className="grid h-10 w-10 place-items-center text-black transition hover:bg-[#F4F4F4]"
                href="/cart"
              >
                <EditIcon />
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="py-8">
                <p className="text-sm text-[#555]">
                  Your cart is empty.
                </p>

                <Link
                  className="mt-4 inline-block text-sm underline underline-offset-4"
                  href="/#shop-hair"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <ul className="mt-6 grid gap-5">
                {items.map((item) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <li
                      className="grid grid-cols-[60px_minmax(0,1fr)] gap-4"
                      key={item.variantId}
                    >
                      <div className="relative h-[60px] w-[60px] overflow-hidden rounded-[5px] bg-[#F3F3F3]">
                        <Image
                          alt={`${item.textureName} cart item`}
                          className="object-contain p-1"
                          fill
                          sizes="60px"
                          src={item.image}
                        />

                        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#555] px-1 text-[11px] font-semibold text-white">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="min-w-0 truncate font-body text-[16px] font-normal text-[#222]">
                            {item.textureName}
                          </h3>

                          <p className="shrink-0 text-[16px] text-[#222]">
                            {formatCheckoutPrice(itemTotal)}
                          </p>
                        </div>

                        <div className="mt-2 grid gap-1 text-[14px] leading-5 text-[#555]">
                          <p>Length: {item.length}</p>
                          <p>Bundle: {item.bundleLabel}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-8 rounded-[5px] border border-[#CFCFCF] px-6 py-3">
              <button
                className="flex min-h-[42px] w-full items-center gap-3 text-left text-[16px] underline underline-offset-2 transition hover:text-[#555]"
                type="button"
              >
                <TagIcon />
                Enter a promo code
              </button>
            </div>

            <div className="mt-8 grid gap-4 text-[17px]">
              <div className="flex items-center justify-between gap-4">
                <span>Subtotal</span>
                <span>{formatCheckoutPrice(cartTotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Delivery</span>
                <span>--</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Sales Tax</span>
                <span>{formatCheckoutPrice(salesTax)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1 text-[20px] font-semibold">
                <span>Total</span>
                <span>{formatCheckoutPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-[#BDBDBD]">
        <div className="checkout-page-frame py-8 text-[14px]">
          <button
            className="underline-offset-2 transition hover:underline"
            type="button"
          >
            Return Policy
          </button>
        </div>
      </footer>
    </main>
  );
}
