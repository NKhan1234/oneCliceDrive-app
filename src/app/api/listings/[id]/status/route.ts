import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "../../../../../../lib/auth";
import { updateListingStatus } from "../../../../../../lib/data-store";

export async function PATCH(
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
    const { status } = await request.json();

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedListing = updateListingStatus(params.id, status);

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
