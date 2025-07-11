import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "../../../../../lib/auth";
import { getListingById, updateListing } from "../../../../../lib/data-store";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getServerSession();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const listing = getListingById(params.id);

  if (!listing) {
    return NextResponse.json(
      { success: false, message: "Listing not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: listing,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getServerSession();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const updates = await request.json();
    const updatedListing = updateListing(params.id, updates);

    if (!updatedListing) {
      return NextResponse.json(
        { success: false, message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedListing,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
