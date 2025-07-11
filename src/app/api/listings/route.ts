import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "../../../../lib/auth";
import { getAllListings } from "../../../../lib/data-store";

export async function GET(request: NextRequest) {
  const user = await getServerSession();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");

  let listings = getAllListings();

  if (status && status !== "all") {
    listings = listings.filter((listing) => listing.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedListings = listings.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: paginatedListings,
    pagination: {
      page,
      limit,
      total: listings.length,
      totalPages: Math.ceil(listings.length / limit),
    },
  });
}
