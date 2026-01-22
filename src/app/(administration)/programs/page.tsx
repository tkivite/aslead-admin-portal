"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Eye, DollarSign, Clock, Users } from "lucide-react";
import { toast } from "react-toastify";
import { programsService } from "@/services/programs.api";
import type { Program } from "@/types/programs.types";
import CreateProgramModal from "./components/create-program-modal";

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const programsData = await programsService.getPrograms();
      setPrograms(programsData);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    fetchPrograms();
    setIsCreateModalOpen(false);
  };

  const handleProgramClick = (programId: number) => {
    router.push(`/programs/${programId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
              <p className="mt-2 text-gray-600">
                Manage academic programs and their details
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Program
            </button>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <motion.div
              key={program.programId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => handleProgramClick(program.programId)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {program.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{program.code}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {program.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProgramClick(program.programId);
                    }}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{program.durationMonths} months</span>
                </div>
                
                {(() => {
                  const tuitionCost = program.costs?.find((c) => c.description === "Tution fees");
                  const kesAmount = tuitionCost ? tuitionCost.amountInKES : program.tuitionFee;
                  const usdAmount = tuitionCost?.amountInUSD;

                  return (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(kesAmount)}</span>
                      </div>
                      {usdAmount && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 ml-6">
                          <span>USD {usdAmount}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}


                {program.contacts && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{program.contacts}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Created: {formatDate(program.createdAt)}
                  </span>
                  {program.updatedAt && (
                    <span>
                      Updated: {formatDate(program.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No programs found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first program.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              Add Program
            </button>
          </div>
        )}
      </div>

      {/* Create Program Modal */}
      <CreateProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
