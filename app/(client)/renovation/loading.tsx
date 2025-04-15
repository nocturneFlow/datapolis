import React from "react";

export default function RenovationLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-10 w-3/4 bg-gray-200 rounded-md animate-pulse mb-4"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generate 6 skeleton cards */}
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
            >
              {/* Image placeholder */}
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>

              {/* Content placeholders */}
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                <div className="h-8 w-1/3 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
