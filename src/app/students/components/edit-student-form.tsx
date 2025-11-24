"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload, X, Eye } from "lucide-react";
import Image from "next/image";
import type { EditStudentFormData } from "./edit-student-modal";
import type { Program } from "@/types/programs.types";
import type { Campus } from "@/types/campuses.types";

interface EditStudentFormProps {
  formData: EditStudentFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditStudentFormData>>;
  onSubmit: () => void;
  programs: Program[];
  campuses: Campus[];
  submitting: boolean;
  documentsLoading: boolean;
}

export default function EditStudentForm({
  formData,
  setFormData,
  onSubmit,
  programs,
  campuses,
  submitting,
  documentsLoading,
}: EditStudentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>("");

  // Get image data URL helper
  const getImageDataUrl = (content: string): string => {
    // Determine MIME type based on content header
    let mimeType = "image/jpeg"; // default
    
    if (content.startsWith("iVBORw0KGgo")) {
      mimeType = "image/png";
    } else if (content.startsWith("/9j/")) {
      mimeType = "image/jpeg";
    } else if (content.startsWith("R0lGOD")) {
      mimeType = "image/gif";
    } else if (content.startsWith("JVBERi")) {
      mimeType = "application/pdf";
    }
    
    return `data:${mimeType};base64,${content}`;
  };

  const openPreview = (content: string, type: string) => {
    setPreviewDocument(content);
    setPreviewType(type);
  };

  const closePreview = () => {
    setPreviewDocument(null);
    setPreviewType("");
  };

  const handleInputChange = (
    field: keyof EditStudentFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentChange = (
    field: keyof EditStudentFormData["documents"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (
    field: keyof EditStudentFormData["documents"],
    file: File
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleDocumentChange(field, result);
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (field: keyof EditStudentFormData["documents"]) => {
    handleDocumentChange(field, "");
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Program & Campus" },
    { number: 3, title: "Documents & Payment" },
  ];
  console.log(formData)

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {step.number}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{step.title}</p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.number ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Citizenship
                </label>
                <input
                  type="text"
                  value={formData.citizenship}
                  onChange={(e) => handleInputChange("citizenship", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Education Level
                </label>
                <select
                  value={formData.currentEducationLevel}
                  onChange={(e) => handleInputChange("currentEducationLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Education Level</option>
                  <option value="High School">High School</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's">Bachelor&apos;s</option>
                  <option value="Master's">Master&apos;s</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identity Type
                </label>
                <select
                  value={formData.identityType}
                  onChange={(e) => handleInputChange("identityType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Identity Type</option>
                  <option value="NATIONAL ID">National ID</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVER'S LICENSE">Driver&apos;s License</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identity Number
                </label>
                <input
                  type="text"
                  value={formData.identityNumber}
                  onChange={(e) => handleInputChange("identityNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Program & Campus */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Program & Campus Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program *
                </label>
                <select
                  required
                  value={formData.programId}
                  onChange={(e) => handleInputChange("programId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Program</option>
                  {programs.map((program) => (
                    <option key={program.programId} value={program.programId.toString()}>
                      {program.name} - {program.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus *
                </label>
                <select
                  required
                  value={formData.campusId}
                  onChange={(e) => handleInputChange("campusId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Campus</option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id.toString()}>
                      {campus.name} - {campus.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Status
                </label>
                <select
                  value={formData.enrollmentStatus}
                  onChange={(e) => handleInputChange("enrollmentStatus", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="ENROLLED">Enrolled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DROPPED">Dropped</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Documents & Payment */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Documents & Payment Information
            </h3>
            
            <div className="space-y-6">
              {/* Payment Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Reference
                </label>
                <input
                  type="text"
                  value={formData.paymentReference}
                  onChange={(e) => handleInputChange("paymentReference", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter payment reference number"
                />
              </div>

              {/* Document Upload Sections */}
              {documentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading documents...</span>
                </div>
              ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* National ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National ID Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {formData.documents.nationalId ? (
                      <div className="space-y-2">
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                          <Image
                            src={getImageDataUrl(formData.documents.nationalId)}
                            alt="National ID"
                            fill
                            className="object-cover cursor-pointer"
                            onClick={() => openPreview(formData.documents.nationalId, "National ID")}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Document uploaded</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openPreview(formData.documents.nationalId, "National ID")}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDocument("nationalId")}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Upload National ID document
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("nationalId", file);
                          }}
                          className="hidden"
                          id="nationalId-upload"
                        />
                        <label
                          htmlFor="nationalId-upload"
                          className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Passport Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Photo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {formData.documents.passportPhoto ? (
                      <div className="space-y-2">
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                          <Image
                            src={getImageDataUrl(formData.documents.passportPhoto)}
                            alt="Passport Photo"
                            fill
                            className="object-cover cursor-pointer"
                            onClick={() => openPreview(formData.documents.passportPhoto, "Passport Photo")}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Photo uploaded</span>
                          <div className="flex gap-2">
	n                            <button
                              type="button"
                              onClick={() => openPreview(formData.documents.passportPhoto, "Passport Photo")}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDocument("passportPhoto")}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Upload passport photo
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("passportPhoto", file);
                          }}
                          className="hidden"
                          id="passportPhoto-upload"
                        />
                        <label
                          htmlFor="passportPhoto-upload"
                          className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Document */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {formData.documents.otherDocument ? (
                      <div className="space-y-2">
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                          <Image
                            src={getImageDataUrl(formData.documents.otherDocument)}
                            alt="Other Document"
                            fill
                            className="object-cover cursor-pointer"
                            onClick={() => openPreview(formData.documents.otherDocument, "Other Document")}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Document uploaded</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openPreview(formData.documents.otherDocument, "Other Document")}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDocument("otherDocument")}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Upload other supporting document
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("otherDocument", file);
                          }}
                          className="hidden"
                          id="otherDocument-upload"
                        />
                        <label
                          htmlFor="otherDocument-upload"
                          className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                </div>
                
                {/* Preview Modal */}
                <AnimatePresence>
                  {previewDocument && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                      onClick={closePreview}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                          <div>
                            <h3 className="font-medium text-gray-900">{previewType}</h3>
                          </div>
                          <button
                            onClick={closePreview}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>

                        {/* Document Content */}
                        <div className="p-4">
                          {previewDocument.startsWith("JVBERi") ? (
                            <div className="w-full h-[70vh]">
                              <iframe
                                src={getImageDataUrl(previewDocument)}
                                className="w-full h-full border-0"
                                title={previewType}
                              />
                            </div>
                          ) : (
                            <Image
                              src={getImageDataUrl(previewDocument)}
                              alt={previewType}
                              width={800}
                              height={600}
                              className="max-w-full max-h-[70vh] object-contain mx-auto"
                            />
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Updating..." : "Update Student"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}



