"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Calendar, Search, ChevronDown } from "lucide-react";
import SearchableSelect from "./SearchableSelect";

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
  showSortFilter = false,
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
  sortOptions = [],
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

              {/* Sort Filter */}
              {showSortFilter && sortOptions.length > 0 && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Sort By</label>
                    <select
                      value={tempFilters.sortBy || "createdAt"}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Sort Direction</label>
                    <select
                      value={tempFilters.sortDirection || "DESC"}
                      onChange={(e) => handleFilterChange("sortDirection", e.target.value as "ASC" | "DESC")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                    >
                      <option value="DESC">Newest First</option>
                      <option value="ASC">Oldest First</option>
                    </select>
                  </div>
                </>
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
                  <SearchableSelect
                    options={[{ value: "", label: "All Statuses" }, ...statusOptions.map((o) => ({ value: o.value, label: o.label }))]}
                    value={tempFilters.status ?? ""}
                    onChange={(v) => handleFilterChange("status", (v as string) || undefined)}
                    placeholder="All Statuses"
                    className="w-full"
                    searchable={true}
                  />
                </div>
              )}

              {/* Enrollment Status Filter */}
              {showEnrollmentStatusFilter && enrollmentStatusOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Enrollment Status</label>
                  <SearchableSelect
                    options={[{ value: "", label: "All Statuses" }, ...enrollmentStatusOptions.map((o) => ({ value: o.value, label: o.label }))]}
                    value={tempFilters.enrollmentStatus ?? ""}
                    onChange={(v) => handleFilterChange("enrollmentStatus", (v as string) || undefined)}
                    placeholder="All Statuses"
                    className="w-full"
                    searchable={true}
                  />
                </div>
              )}

              {/* Campus Filter */}
              {showCampusFilter && campusOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Campus</label>
                  <SearchableSelect
                    options={[{ value: "", label: "All Campuses" }, ...campusOptions.map((o) => ({ value: o.value, label: o.label }))]}
                    value={tempFilters.campusId ?? ""}
                    onChange={(v) => handleFilterChange("campusId", v === "" ? undefined : Number(v))}
                    placeholder="All Campuses"
                    className="w-full"
                    searchable={true}
                  />
                </div>
              )}

              {/* Program Filter */}
              {showProgramFilter && programOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <SearchableSelect
                    options={[{ value: "", label: "All Programs" }, ...programOptions.map((o) => ({ value: o.value, label: o.label }))]}
                    value={tempFilters.programId ?? ""}
                    onChange={(v) => handleFilterChange("programId", v === "" ? undefined : Number(v))}
                    placeholder="All Programs"
                    className="w-full"
                    searchable={true}
                  />
                </div>
              )}

              {/* Country Filter */}
              {showCountryFilter && countryOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <SearchableSelect
                    options={[{ value: "", label: "All Countries" }, ...countryOptions.map((o) => ({ value: o.value, label: o.label }))]}
                    value={tempFilters.country ?? ""}
                    onChange={(v) => handleFilterChange("country", (v as string) || undefined)}
                    placeholder="All Countries"
                    className="w-full"
                    searchable={true}
                  />
                </div>
              )}

              {/* County Filter */}
              {showCountyFilter && countyOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">County</label>
                  <SearchableSelect
                    options={[{ value: "", label: "All Counties" }, ...countyOptions.map((o) => ({ value: o.value, label: o.label }))]}
                    value={tempFilters.county ?? ""}
                    onChange={(v) => handleFilterChange("county", (v as string) || undefined)}
                    placeholder="All Counties"
                    className="w-full"
                    searchable={true}
                  />
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
