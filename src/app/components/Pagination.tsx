"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePages = pages.filter((page) => {
    return (
      Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages
    );
  });

  const baseBtn =
    "px-3 py-1 border rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const outlineBtn = `${baseBtn} border-gray-300 bg-white text-gray-800 hover:bg-gray-100`;
  const activeBtn = `${baseBtn} bg-black text-white border-gray-600`;

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className={outlineBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="hidden sm:inline-block h-4 w-4  mr-1" />
        Previous
      </button>

      {visiblePages.map((page, index) => {
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center">
            {showEllipsis && <span className="px-2">...</span>}
            <button
              className={currentPage === page ? activeBtn : outlineBtn}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        className={outlineBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="hidden h-4 w-4 sm:inline-block ml-1" />
      </button>
    </div>
  );
}
