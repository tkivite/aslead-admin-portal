"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  X,
  Check,

  Plus,
  BookOpen,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { programsService } from "@/services/programs.api";
import { courseUnitsService } from "@/services/course-units.api";
import SearchableSelect from "@/app/components/common/SearchableSelect";
import type {
  Program,
  UpdateProgramData,
  ProgramCost,
} from "@/types/programs.types";
import type {
  CourseUnit,
  CourseUnitCreateRequest,
} from "@/types/courses.types";

export default function ProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const programId = parseInt(params.programId as string);

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateProgramData>({
    code: "",
    name: "",
    description: "",
    durationMonths: 0,
    tuitionFee: "",
    contacts: "",
  });

  // Units state
  const [units, setUnits] = useState<CourseUnit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<CourseUnit | null>(null);
  const [unitForm, setUnitForm] = useState<CourseUnitCreateRequest>({
    code: "",
    name: "",
    description: "",
    academicYear: 1,
    session: 1,
    compuslory: true,
    creditHours: 0,
  });

  // Cost state
  const [showEditCostModal, setShowEditCostModal] = useState(false);
  const [editingCost, setEditingCost] = useState<ProgramCost | null>(null);
  const [costForm, setCostForm] = useState({
    description: "",
    amountInKES: 0,
    amountInUSD: 0 as number | null,
  });

  const fetchProgram = useCallback(async () => {
    try {
      setLoading(true);
      const programData = await programsService.getProgramById(programId);
      setProgram(programData);
      setFormData({
        code: programData.code,
        name: programData.name,
        description: programData.description,
        durationMonths: programData.durationMonths,
        tuitionFee: programData.tuitionFee.toString(),
        contacts: programData.contacts || "",
      });
    } catch (error) {
      console.error("Error fetching program:", error);
      toast.error("Failed to load program. Please try again.");
      router.push("/programs");
    } finally {
      setLoading(false);
    }
  }, [programId, router]);

  const fetchUnits = useCallback(async () => {
    try {
      setLoadingUnits(true);
      const unitsData = await courseUnitsService.getCourseUnits(programId);
      setUnits(unitsData);
    } catch (error) {
      console.error("Error fetching units:", error);
      toast.error("Failed to load course units. Please try again.");
    } finally {
      setLoadingUnits(false);
    }
  }, [programId]);

  useEffect(() => {
    if (programId) {
      fetchProgram();
      fetchUnits();
    }
  }, [programId, fetchProgram, fetchUnits]);

  const handleInputChange = (
    field: keyof UpdateProgramData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!program) return;

    if (!formData.code || !formData.name || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      const updatedProgram = await programsService.updateProgram(
        programId,
        formData,
      );
      setProgram(updatedProgram);
      setEditing(false);
      toast.success("Program updated successfully!");
    } catch (error) {
      console.error("Error updating program:", error);
      toast.error("Failed to update program. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (program) {
      setFormData({
        code: program.code,
        name: program.name,
        description: program.description,
        durationMonths: program.durationMonths,
        tuitionFee: program.tuitionFee.toString(),
        contacts: program.contacts || "",
      });
    }
    setEditing(false);
  };

  // Unit management functions
  const handleUnitInputChange = (
    field: keyof CourseUnitCreateRequest,
    value: string | number | boolean,
  ) => {
    setUnitForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddUnit = () => {
    setUnitForm({
      code: "",
      name: "",
      description: "",
      academicYear: 1,
      session: 1,
      compuslory: true,
      creditHours: 0,
    });
    setEditingUnit(null);
    setShowAddUnitModal(true);
  };

  const handleEditUnit = (unit: CourseUnit) => {
    setUnitForm({
      code: unit.code,
      name: unit.name,
      description: unit.description,
      academicYear: unit.academicYear,
      session: unit.session,
      compuslory: unit.compuslory,
      creditHours: unit.creditHours,
    });
    setEditingUnit(unit);
    setShowAddUnitModal(true);
  };

  const handleSaveUnit = async () => {
    if (!unitForm.code || !unitForm.name || !unitForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingUnit) {
        await courseUnitsService.updateCourseUnit(
          programId,
          editingUnit.unitId,
          unitForm,
        );
        toast.success("Course unit updated successfully!");
      } else {
        await courseUnitsService.createCourseUnit(programId, unitForm);
        toast.success("Course unit created successfully!");
      }

      setShowAddUnitModal(false);
      setEditingUnit(null);
      await fetchUnits();
    } catch (error) {
      console.error("Error saving unit:", error);
      toast.error("Failed to save course unit. Please try again.");
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (window.confirm("Are you sure you want to delete this course unit?")) {
      try {
        await courseUnitsService.deleteCourseUnit(programId, unitId);
        toast.success("Course unit deleted successfully!");
        await fetchUnits();
      } catch (error) {
        console.error("Error deleting unit:", error);
        toast.error("Failed to delete course unit. Please try again.");
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const formatUSD = (amount: number | null) => {
    if (amount === null) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };


  /* Cost Management Functions */
  const handleAddCost = () => {
    setEditingCost(null);
    setCostForm({
      description: "",
      amountInKES: 0,
      amountInUSD: null,
    });
    setShowEditCostModal(true);
  };

  const handleEditCost = (cost: ProgramCost) => {
    setEditingCost(cost);
    setCostForm({
      description: cost.description,
      amountInKES: cost.amountInKES,
      amountInUSD: cost.amountInUSD,
    });
    setShowEditCostModal(true);
  };

  const handleSaveCost = async () => {
    if (!program) return;

    try {
      if (editingCost) {
        await programsService.updateProgramCost(
          program.programId,
          editingCost.costId,
          costForm,
        );
        toast.success("Cost updated successfully!");
      } else {
        await programsService.addProgramCost(program.programId, costForm);
        toast.success("Cost added successfully!");
      }
      setShowEditCostModal(false);
      setEditingCost(null);
      fetchProgram(); // Refresh data
    } catch (error) {
      console.error("Error saving cost:", error);
      toast.error("Failed to save cost. Please try again.");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
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

  if (!program) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Program not found
          </h2>
          <p className="text-gray-600 mb-4">
            The program you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/programs")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/programs")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Programs
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-transparent border-b-2 border-primary outline-none"
                  />
                ) : (
                  program.name
                )}
              </h1>
              <p className="text-lg text-gray-600">
                {editing ? (
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    className="bg-transparent border-b-2 border-primary outline-none"
                  />
                ) : (
                  program.code
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Program
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Program Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600">{program.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        min="1"
                        value={formData.durationMonths}
                        onChange={(e) =>
                          handleInputChange(
                            "durationMonths",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-600">
                        {program.durationMonths} months
                      </p>
                    )}
                  </div>

                
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.contacts}
                      onChange={(e) =>
                        handleInputChange("contacts", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-600">
                      {program.contacts || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Course Units Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Units
                </h2>
                <button
                  onClick={handleAddUnit}
                  className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Unit
                </button>
              </div>

              {loadingUnits ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : units.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year/Session
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {units.map((unit) => (
                        <tr key={unit.unitId} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {unit.code}
                          </td>
                          <td
                            className="px-4 py-4 text-sm text-gray-900 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/programs/${programId}/course-units/${unit.unitId}`,
                              )
                            }
                          >
                            <div>
                              <button className="font-medium text-left hover:underline">
                                {unit.name}
                              </button>
                              <div className="text-gray-500 text-xs mt-1 line-clamp-2">
                                {unit.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {unit.creditHours}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            Year {unit.academicYear}, Session {unit.session}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {unit.compuslory ? (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Compulsory
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Optional
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditUnit(unit)}
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUnit(unit.unitId)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No course units yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start building your program by adding course units.
                  </p>
                  <button
                    onClick={handleAddUnit}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Unit
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
           

             {/* Program Costs Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Program Costs
                </h3>
                <button
                  onClick={handleAddCost}
                  className="p-1 text-primary hover:bg-blue-50 rounded-full transition-colors"
                  title="Add Cost"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {program.costs && program.costs.length > 0 ? (
                  program.costs.map((cost) => (
                    <div
                      key={cost.costId}
                      className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {cost.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(cost.amountInKES)}
                        </p>
                        {cost.amountInUSD && (
                          <p className="text-xs text-gray-500">
                            {formatUSD(cost.amountInUSD)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleEditCost(cost)}
                        className="p-1 text-primary hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No additional costs listed.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Timeline Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(program.createdAt)}
                  </p>
                </div>

                {program.updatedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(program.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

           
          </div>
        </div>
      </div>

      {/* Edit Cost Modal */}
      {showEditCostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingCost ? "Edit Cost" : "Add Cost"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={costForm.description}
                  onChange={(e) =>
                    setCostForm({ ...costForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (KES)
                </label>
                <input
                  type="text"
                  value={costForm.amountInKES}
                  onChange={(e) =>
                    setCostForm({
                      ...costForm,
                      amountInKES: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (USD) - Optional
                </label>
                <input
                  type="text"
                  value={costForm.amountInUSD || ""}
                  onChange={(e) =>
                    setCostForm({
                      ...costForm,
                      amountInUSD: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Leave empty if not applicable"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditCostModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCost}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Unit Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingUnit ? "Edit Course Unit" : "Add New Course Unit"}
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Code *
                  </label>
                  <input
                    type="text"
                    value={unitForm.code}
                    onChange={(e) =>
                      handleUnitInputChange("code", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. CS101"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Name *
                  </label>
                  <input
                    type="text"
                    value={unitForm.name}
                    onChange={(e) =>
                      handleUnitInputChange("name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credits *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitForm.creditHours}
                    onChange={(e) =>
                      handleUnitInputChange(
                        "creditHours",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                  </label>
                  <SearchableSelect
                    options={[
                      { value: 1, label: "Year 1" },
                      { value: 2, label: "Year 2" },
                      { value: 3, label: "Year 3" },
                      { value: 4, label: "Year 4" },
                      { value: 5, label: "Year 5" },
                      { value: 6, label: "Year 6" },
                    ]}
                    value={unitForm.academicYear ?? null}
                    onChange={(v: string | number | null) =>
                      handleUnitInputChange("academicYear", Number(v))
                    }
                    placeholder="Select Year"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session *
                  </label>
                  <SearchableSelect
                    options={[
                      { value: 1, label: "Session 1" },
                      { value: 2, label: "Session 2" },
                      { value: 3, label: "Session 3" },
                      { value: 4, label: "Session 4" },
                    ]}
                    value={unitForm.session ?? null}
                    onChange={(v: string | number | null) =>
                      handleUnitInputChange("session", Number(v))
                    }
                    placeholder="Select Session"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compulsory *
                  </label>
                  <SearchableSelect
                    options={[
                      { value: "true", label: "Compulsory" },
                      { value: "false", label: "Optional" },
                    ]}
                    value={unitForm.compuslory ? "true" : "false"}
                    onChange={(v: string | number | null) =>
                      handleUnitInputChange("compuslory", v === "true")
                    }
                    className="w-full"
                    placeholder="Select"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={unitForm.description}
                    onChange={(e) =>
                      handleUnitInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUnit}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingUnit ? "Update Unit" : "Add Unit"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
