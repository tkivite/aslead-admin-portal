"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Calendar, Search, ChevronDown } from "lucide-react";

export interface FilterOptions {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  enrollmentStatus?: string;
  campusId?: number;
  programId?: number;
  country?: string;
  county?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

interface TableFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  showStatusFilter?: boolean;
  showEnrollmentStatusFilter?: boolean;
  showDateRangeFilter?: boolean;
  showSearchFilter?: boolean;
  showSortFilter?: boolean;
  showCampusFilter?: boolean;
  showProgramFilter?: boolean;
  showCountryFilter?: boolean;
  showCountyFilter?: boolean;
  statusOptions?: Array<{ value: string; label: string }>;
  enrollmentStatusOptions?: Array<{ value: string; label: string }>;
  campusOptions?: Array<{ value: number; label: string }>;
  programOptions?: Array<{ value: number; label: string }>;
  countryOptions?: Array<{ value: string; label: string }>;
  countyOptions?: Array<{ value: string; label: string }>;
  sortOptions?: Array<{ value: string; label: string }>;
  initialFilters?: FilterOptions;
}

export default function TableFilters({
  onFiltersChange,
  showStatusFilter = false,
  showEnrollmentStatusFilter = false,
  showDateRangeFilter = true,
  showSearchFilter = true,

  showCampusFilter = false,
  showProgramFilter = false,
  showCountryFilter = false,
  showCountyFilter = false,
  statusOptions = [],
  enrollmentStatusOptions = [],
  campusOptions = [],
  programOptions = [],
  countryOptions = [],
  countyOptions = [],

  initialFilters = {},
}: TableFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>({
    search: "",
    startDate: "",
    endDate: "",
    status: "",
    enrollmentStatus: "",
    campusId: undefined,
    programId: undefined,
    country: "",
    county: "",
    sortBy: "createdAt",
    sortDirection: "DESC",
    ...initialFilters,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
    search: "",
    startDate: "",
    endDate: "",
    status: "",
    enrollmentStatus: "",
    campusId: undefined,
    programId: undefined,
    country: "",
    county: "",
    sortBy: "createdAt",
    sortDirection: "DESC",
    ...initialFilters,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    const newFilters = { ...tempFilters, [key]: value };
    setTempFilters(newFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    onFiltersChange(tempFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      search: "",
      startDate: "",
      endDate: "",
      status: "",
      enrollmentStatus: "",
      campusId: undefined,
      programId: undefined,
      country: "",
      county: "",
      sortBy: "createdAt",
      sortDirection: "DESC",
    };
    setTempFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return (
      appliedFilters.search ||
      appliedFilters.startDate ||
      appliedFilters.endDate ||
      appliedFilters.status ||
      appliedFilters.enrollmentStatus ||
      appliedFilters.campusId ||
      appliedFilters.programId ||
      appliedFilters.country ||
      appliedFilters.county ||
      appliedFilters.sortBy !== "createdAt" ||
      appliedFilters.sortDirection !== "DESC"
    );
  };

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isOpen || hasActiveFilters()
              ? "bg-tertiary text-white border-tertiary"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters() && (
            <span className="bg-white text-tertiary text-xs px-2 py-1 rounded-full">
              {Object.values(appliedFilters).filter(Boolean).length}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Search Filter */}
              {showSearchFilter && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Search className="inline h-4 w-4 mr-1" />
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={tempFilters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  />
                </div>
              )}

              {/* Date Range Filter */}
              {showDateRangeFilter && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tempFilters.startDate || ""}
                      onChange={(e) => handleFilterChange("startDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tempFilters.endDate || ""}
                      onChange={(e) => handleFilterChange("endDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Status Filter */}
              {showStatusFilter && statusOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={tempFilters.status || ""}
                    onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Enrollment Status Filter */}
              {showEnrollmentStatusFilter && enrollmentStatusOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Enrollment Status</label>
                  <select
                    value={tempFilters.enrollmentStatus || ""}
                    onChange={(e) => handleFilterChange("enrollmentStatus", e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {enrollmentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Campus Filter */}
              {showCampusFilter && campusOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Campus</label>
                  <select
                    value={tempFilters.campusId || ""}
                    onChange={(e) => handleFilterChange("campusId", e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  >
                    <option value="">All Campuses</option>
                    {campusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Program Filter */}
              {showProgramFilter && programOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <select
                    value={tempFilters.programId || ""}
                    onChange={(e) => handleFilterChange("programId", e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  >
                    <option value="">All Programs</option>
                    {programOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Country Filter */}
              {showCountryFilter && countryOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    value={tempFilters.country || ""}
                    onChange={(e) => handleFilterChange("country", e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {countryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* County Filter */}
              {showCountyFilter && countyOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">County</label>
                  <select
                    value={tempFilters.county || ""}
                    onChange={(e) => handleFilterChange("county", e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  >
                    <option value="">All Counties</option>
                    {countyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}


            </div>
            
            {/* Filter Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-tertiary text-white rounded-lg hover:bg-tertiary/90 transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
