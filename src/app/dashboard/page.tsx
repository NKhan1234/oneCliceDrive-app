"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Car, Users, TrendingUp, Filter } from "lucide-react";
import { getAllListings } from "../../../lib/data-store";
import { logout, isAuthenticated } from "../../../lib/auth";
import { ListingTable } from "../components/ListingTable";
import { Pagination } from "../components/Pagination";
import { useApp, useNotifications } from "../contexts/AppContext";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { addNotification } = useNotifications();

  const itemsPerPage = 5;
  console.log(addNotification);
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const loadListings = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const listings = getAllListings();
      dispatch({ type: "SET_LISTINGS", payload: listings });
      setIsLoading(false);
    };

    loadListings();
  }, [router, dispatch]);

  const { filteredListings, paginatedListings, totalPages } = useMemo(() => {
    let filtered = state.listings;
    if (statusFilter !== "all") {
      filtered = filtered.filter((listing) => listing.status === statusFilter);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    return {
      filteredListings: filtered,
      paginatedListings: paginated,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [state.listings, statusFilter, currentPage]);
  console.log(filteredListings);
  const handleLogout = () => {
    logout();
    dispatch({ type: "SET_USER", payload: null });
    router.push("/login");
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const getStats = () => {
    const total = state.listings.length;
    const pending = state.listings.filter((l) => l.status === "pending").length;
    const approved = state.listings.filter(
      (l) => l.status === "approved"
    ).length;
    const rejected = state.listings.filter(
      (l) => l.status === "rejected"
    ).length;
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto md:px-4 px-2 md:py-4 py-2 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="flex items-center">
            <Car className="sm:h-8 h-6 sm:w-8 w-6 text-black mr-1.5 sm:mr-3" />
            <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900">
              Car Rental Admin Dashboard
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-center sm:space-x-4 gap-2">
            <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Welcome, Admin:Nadeem Khan
            </span>
            <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Listings",
              count: stats.total,
              icon: <Car />,
              color: "text-black",
            },
            {
              title: "Pending Review",
              count: stats.pending,
              icon: <Users />,
              color: "text-black",
            },
            {
              title: "Approved",
              count: stats.approved,
              icon: <TrendingUp />,
              color: "text-black",
            },
            {
              title: "Rejected",
              count: stats.rejected,
              icon: <TrendingUp />,
              color: "text-black",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <div className="text-gray-400 h-4 w-4">{item.icon}</div>
              </div>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.count}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="flex justify-between items-center px-4 pt-4">
            <div>
              <h2 className="text-lg font-semibold">Car Listings</h2>
              <p className="text-sm text-gray-500">
                Manage and review car rental listings submitted by users
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : paginatedListings.length > 0 ? (
              <>
                <ListingTable listings={paginatedListings} />
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No listings found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
