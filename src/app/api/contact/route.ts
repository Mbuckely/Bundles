import { NextRequest, NextResponse } from "next/server";

type ContactRequest = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  orderNumber?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as ContactRequest;

    const requiredFields = [
      data.firstName,
      data.lastName,
      data.email,
      data.message,
    ];

    const hasMissingField = requiredFields.some((field) => !field?.trim());

    if (hasMissingField) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete first name, last name, email, and message.",
        },
        { status: 400 },
      );
    }

    console.log("New contact submission:", {
      name:
        data.name ??
        `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
      email: data.email,
      phone: data.phone?.trim()
        ? `${data.countryCode ?? ""} ${data.phone}`.trim()
        : "",
      orderNumber: data.orderNumber,
      message: data.message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message received.",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid contact form submission.",
      },
      { status: 500 },
    );
  }
}
