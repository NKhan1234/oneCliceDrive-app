import { NextResponse } from "next/server";
import { getServerSession } from "../../../../../lib/auth";

export async function GET() {
  const user = await getServerSession();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}
