"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, MapPin, Building, Globe, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { campusesService } from "@/services/campuses.api";
import type { Campus } from "@/types/campuses.types";
import CreateCampusModal from "./components/create-campus-modal";
import EditCampusModal from "./components/edit-campus-modal";
import TableFilters, { FilterOptions } from "@/app/components/common/TableFilters";

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10,
  });
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [allCampuses, setAllCampuses] = useState<Campus[]>([]);

  const fetchCampuses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await campusesService.getPaginatedCampuses(pagination.currentPage, pagination.size, {
        search: filters.search,
        sortBy: filters.sortBy || "createdAt",
        sortDirection: filters.sortDirection || "DESC",
        country: filters.country,
        county: filters.county,
      });
      setCampuses(response.content);
      setPagination({
        currentPage: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        size: response.size,
      });
    } catch (error) {
      console.error("Error fetching campuses:", error);
      toast.error("Failed to load campuses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.size, filters]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const fetchAllCampuses = async () => {
    try {
      const response = await campusesService.getCampuses();
      setAllCampuses(response);
    } catch (error) {
      console.error("Error fetching all campuses:", error);
    }
  };

  // Get unique countries and counties for filter options
  const getUniqueCountries = () => {
    const countries = [...new Set(allCampuses.map(campus => campus.country))];
    return countries.sort();
  };

  const getUniqueCounties = () => {
    const counties = [...new Set(allCampuses.map(campus => campus.county))];
    return counties.sort();
  };

  useEffect(() => {
    fetchCampuses();
    fetchAllCampuses();
  }, [fetchCampuses]);

  const handleCreateSuccess = () => {
    fetchCampuses();
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    fetchCampuses();
    setIsEditModalOpen(false);
    setSelectedCampus(null);
  };

  const handleEditClick = (campus: Campus) => {
    setSelectedCampus(campus);
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campuses</h1>
              <p className="mt-2 text-gray-600">
                Manage campus locations and information
              </p>
            </div>
            <div className="flex items-center gap-4">
           
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Campus
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TableFilters
          onFiltersChange={setFilters}
          showSearchFilter={true}
          showCountryFilter={true}
          showCountyFilter={true}
          showSortFilter={true}
          showDateRangeFilter={false}
          countryOptions={getUniqueCountries().map(country => ({
            value: country,
            label: country
          }))}
          countyOptions={getUniqueCounties().map(county => ({
            value: county,
            label: county
          }))}
          sortOptions={[
            { value: "createdAt", label: "Created Date" },
            { value: "name", label: "Name" },
            { value: "location", label: "Location" },
            { value: "county", label: "County" },
            { value: "country", label: "Country" },
          ]}
        />
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Campuses Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    County
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campuses.map((campus) => (
                  <motion.tr
                    key={campus.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {campus.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {campus.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {campus.county}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        {campus.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(campus.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(campus)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {pagination.currentPage * pagination.size + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (pagination.currentPage + 1) * pagination.size,
                  pagination.totalElements
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalElements}</span>{" "}
              results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = i;
                  } else if (pagination.currentPage < 3) {
                    pageNumber = i;
                  } else if (pagination.currentPage >= pagination.totalPages - 3) {
                    pageNumber = pagination.totalPages - 5 + i;
                  } else {
                    pageNumber = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        pageNumber === pagination.currentPage
                          ? "bg-primary text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {campuses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campuses found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first campus.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Campus
            </button>
          </div>
        )}
      </div>

      {/* Create Campus Modal */}
      <CreateCampusModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Campus Modal */}
      <EditCampusModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCampus(null);
        }}
        onSuccess={handleEditSuccess}
        campus={selectedCampus}
      />
    </div>
  );
}
