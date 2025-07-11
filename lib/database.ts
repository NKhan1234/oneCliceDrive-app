export interface CarListing {
  id: string;
  title: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submittedAt: string;
  updatedAt: string;
}

// Mock database - in production, this would be a real database
const listings: CarListing[] = [
  {
    id: "1",
    title: "Luxury BMW X5 - Perfect for Business Trips",
    description: "Spacious and comfortable SUV with premium features",
    brand: "BMW",
    model: "X5",
    year: 2023,
    pricePerDay: 120,
    location: "Delhi, India",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "pending",
    submittedBy: "user1@example.com",
    submittedAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Eco-Friendly Tesla Model 3",
    description: "Electric vehicle with autopilot features",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    pricePerDay: 95,
    location: "Mumbai, India",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "approved",
    submittedBy: "user2@example.com",
    submittedAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "3",
    title: "Classic Ford Mustang Convertible",
    description: "Vintage convertible for special occasions",
    brand: "Ford",
    model: "Mustang",
    year: 2022,
    pricePerDay: 85,
    location: "Pune, India",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "rejected",
    submittedBy: "user3@example.com",
    submittedAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T11:30:00Z",
  },
  {
    id: "4",
    title: "Family-Friendly Honda CR-V",
    description: "Reliable SUV perfect for family trips",
    brand: "Honda",
    model: "CR-V",
    year: 2023,
    pricePerDay: 75,
    location: "Rudrapur, India",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "pending",
    submittedBy: "user4@example.com",
    submittedAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "5",
    title: "Sporty Audi A4 Sedan",
    description: "Performance sedan with luxury interior",
    brand: "Audi",
    model: "A4",
    year: 2023,
    pricePerDay: 100,
    location: "Haldwani, India",
    imageUrl: "/placeholder.svg?height=200&width=300",
    status: "approved",
    submittedBy: "user5@example.com",
    submittedAt: "2024-01-11T13:20:00Z",
    updatedAt: "2024-01-11T15:10:00Z",
  },
];

export function getAllListings(): CarListing[] {
  return listings;
}

export function getListingById(id: string): CarListing | undefined {
  return listings.find((listing) => listing.id === id);
}

export function updateListing(
  id: string,
  updates: Partial<CarListing>
): CarListing | null {
  const index = listings.findIndex((listing) => listing.id === id);
  if (index === -1) return null;

  listings[index] = {
    ...listings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return listings[index];
}

export function updateListingStatus(
  id: string,
  status: CarListing["status"]
): CarListing | null {
  return updateListing(id, { status });
}
