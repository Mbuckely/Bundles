import { NextRequest, NextResponse } from "next/server";

type PromoRequest = {
  code?: unknown;
};

function normalizePromoCode(code: unknown) {
  return String(code ?? "").trim().toUpperCase();
}

function getPromoDiscountPercent() {
  const configuredPercent = Number(process.env.PROMO_CODE_10_PERCENT);

  if (Number.isFinite(configuredPercent) && configuredPercent > 0) {
    return Math.min(configuredPercent, 100);
  }

  return 10;
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as PromoRequest;
    const submittedCode = normalizePromoCode(data.code);
    const validCode = normalizePromoCode(process.env.PROMO_CODE_10);

    if (!submittedCode || !validCode || submittedCode !== validCode) {
      return NextResponse.json(
        {
          valid: false,
          discountPercent: 0,
          message: "Invalid code",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        valid: true,
        discountPercent: getPromoDiscountPercent(),
        message: "Promo code applied",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        valid: false,
        discountPercent: 0,
        message: "Invalid code",
      },
      { status: 400 },
    );
  }
}
