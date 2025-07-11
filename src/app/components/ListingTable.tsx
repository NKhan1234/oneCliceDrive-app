"use client";

import { useState } from "react";
import { Edit, Check, X, Eye } from "lucide-react";
import type { CarListing } from "../../../lib/data-store";
import { useApp, useNotifications } from "../contexts/AppContext";
import { updateListingStatus } from "../../../lib/data-store";
import { EditListingForm } from "./EditListingForm";
import Image from "next/image";

interface ListingTableProps {
  listings: CarListing[];
}

export function ListingTable({ listings }: ListingTableProps) {
  const [selectedListing, setSelectedListing] = useState<CarListing | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  );
  const { dispatch } = useApp();
  const { addNotification } = useNotifications();

  const handleStatusChange = async (
    listingId: string,
    status: "approved" | "rejected"
  ) => {
    setLoadingActions((prev) => ({ ...prev, [listingId]: true }));
    await new Promise((resolve) => setTimeout(resolve, 500));
    const updatedListing = updateListingStatus(listingId, status);

    if (updatedListing) {
      dispatch({ type: "UPDATE_LISTING", payload: updatedListing });
      addNotification({
        type: "success",
        message: `Listing ${status} successfully`,
      });
    } else {
      addNotification({ type: "error", message: "Failed to update listing" });
    }
    setLoadingActions((prev) => ({ ...prev, [listingId]: false }));
  };

  const handleEdit = (listing: CarListing) => {
    setSelectedListing(listing);
    setIsEditDialogOpen(true);
  };

  const handleView = (listing: CarListing) => {
    setSelectedListing(listing);
    setIsViewDialogOpen(true);
  };

  const handleEditSuccess = (updatedListing: CarListing) => {
    dispatch({ type: "UPDATE_LISTING", payload: updatedListing });
    setIsEditDialogOpen(false);
    addNotification({
      type: "success",
      message: "Listing updated successfully",
    });
  };

  const getStatusBadge = (status: CarListing["status"]) => {
    const base = "px-2 py-1 text-xs font-medium rounded capitalize";
    const variants = {
      pending: "bg-gray-200 text-gray-800",
      approved: "bg-gray-200 text-gray-800",
      rejected: "bg-gray-200 text-gray-800",
    };
    return <span className={`${base} ${variants[status]}`}>{status}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="overflow-auto rounded-md border">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 hidden sm:table-cell">Listing</th>
              <th className="p-3 hidden md:table-cell">Vehicle</th>
              <th className="p-3">Price/Day</th>
              <th className="p-3 hidden lg:table-cell">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden xl:table-cell">Submitted</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      width={40}
                      height={35}
                      className="h-12 w-16 object-cover rounded"
                    />
                    <div className="hidden sm:block">
                      <div className="font-medium">{listing.title}</div>
                      <div className="text-xs text-gray-500">
                        by {listing.submittedBy}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div>
                    <div className="font-medium">
                      {listing.brand} {listing.model}
                    </div>
                    <div className="text-xs text-gray-500">{listing.year}</div>
                  </div>
                </td>
                <td className="p-3 font-medium">₹{listing.pricePerDay}</td>
                <td className="p-3 hidden lg:table-cell">{listing.location}</td>
                <td className="p-3">{getStatusBadge(listing.status)}</td>
                <td className="p-3 text-xs hidden xl:table-cell">
                  {formatDate(listing.submittedAt)}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 hover:text-black/80"
                      onClick={() => handleView(listing)}
                      aria-label="View listing"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 hover:text-yellow-600"
                      onClick={() => handleEdit(listing)}
                      aria-label="Edit listing"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {listing.status === "pending" && (
                      <>
                        <button
                          className="p-1 text-green-600 hover:text-green-800"
                          disabled={loadingActions[listing.id]}
                          onClick={() =>
                            handleStatusChange(listing.id, "approved")
                          }
                          aria-label="Approve listing"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800"
                          disabled={loadingActions[listing.id]}
                          onClick={() =>
                            handleStatusChange(listing.id, "rejected")
                          }
                          aria-label="Reject listing"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditDialogOpen && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-md max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Edit Listing</h2>
              <p className="text-sm text-gray-500">
                Make changes to the listing below.
              </p>
            </div>
            <EditListingForm
              listing={selectedListing}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </div>
        </div>
      )}

      {isViewDialogOpen && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-md max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Listing Details</h2>
            </div>
            <Image
              src={selectedListing.imageUrl}
              alt={selectedListing.title}
              width={550}
              height={400}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold">Title</h3>
                <p>{selectedListing.title}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                {getStatusBadge(selectedListing.status)}
              </div>
              <div>
                <h3 className="font-semibold">Vehicle</h3>
                <p>
                  {selectedListing.brand} {selectedListing.model} (
                  {selectedListing.year})
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Price per Day</h3>
                <p>₹{selectedListing.pricePerDay}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>{selectedListing.location}</p>
              </div>
              <div>
                <h3 className="font-semibold">Submitted By</h3>
                <p>{selectedListing.submittedBy}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Description</h3>
              <p>{selectedListing.description}</p>
            </div>
            <button
              onClick={() => setIsViewDialogOpen(false)}
              className="mt-6 inline-block text-sm text-black hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
