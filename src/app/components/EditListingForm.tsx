"use client";

import React, { useState } from "react";
import type { CarListing } from "../../../lib/data-store";
import { updateListing } from "../../../lib/data-store";

interface EditListingFormProps {
  listing: CarListing;
  onSuccess: (updatedListing: CarListing) => void;
  onCancel: () => void;
}

export function EditListingForm({
  listing,
  onSuccess,
  onCancel,
}: EditListingFormProps) {
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    brand: listing.brand,
    model: listing.model,
    year: listing.year.toString(),
    pricePerDay: listing.pricePerDay.toString(),
    location: listing.location,
    status: listing.status,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedListing = updateListing(listing.id, {
      ...formData,
      year: parseInt(formData.year),
      pricePerDay: parseFloat(formData.pricePerDay),
    });

    if (updatedListing) {
      onSuccess(updatedListing);
    }

    setIsLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-center justify-center space-y-4 w-full h-auto"
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label htmlFor="title" className="block font-medium">
            Title
          </label>
          <input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="w-full px-3 py-1 border rounded"
          />
        </div>
        <div>
          <label htmlFor="brand" className="block font-medium ">
            Brand
          </label>
          <input
            id="brand"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            required
            className="w-full px-3 py-1 border rounded"
          />
        </div>
        <div>
          <label htmlFor="model" className="block font-medium">
            Model
          </label>
          <input
            id="model"
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            required
            className="w-full px-3 py-1 border rounded"
          />
        </div>
        <div>
          <label htmlFor="year" className="block font-medium ">
            Year
          </label>
          <input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => handleChange("year", e.target.value)}
            required
            className="w-full px-3 py-1 border rounded"
          />
        </div>
        <div>
          <label htmlFor="pricePerDay" className="block font-medium">
            Price per Day (₹)
          </label>
          <input
            id="pricePerDay"
            type="number"
            step="0.01"
            value={formData.pricePerDay}
            onChange={(e) => handleChange("pricePerDay", e.target.value)}
            required
            className="w-full px-3 py-1 border rounded"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="location" className="block font-medium">
            Location
          </label>
          <input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
            className="w-full px-3 py-1 border rounded"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="status" className="block font-medium">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-3 py-1 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="col-span-2">
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            required
            className="w-full px-3 py-1 border rounded"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-black/90 text-white rounded hover:bg-black disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Listing"}
        </button>
      </div>
    </form>
  );
}
