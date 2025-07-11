import { type NextRequest, NextResponse } from "next/server";
import { generateToken, mockUser } from "../../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === "admin@example.com" && password === "admin123") {
      const token = generateToken(mockUser);

      const response = NextResponse.json({
        success: true,
        user: mockUser,
      });

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
