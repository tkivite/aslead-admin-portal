"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import type {  Campus } from "@/types/students.types";
import type { Program } from "@/types/programs.types";
import type { EditApplicationFormData } from "./edit-application-modal";

interface EditApplicationFormProps {
  formData: EditApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditApplicationFormData>>;
  onSubmit: (data: EditApplicationFormData) => void;
  programs: Program[];
  campuses: Campus[];
  submitting: boolean;
}

export default function EditApplicationForm({
  formData,
  setFormData,
  onSubmit,
  programs,
  campuses,
  submitting,
}: EditApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<{
    nationalId: string | null;
    passportPhoto: string | null;
    otherDocument: string | null;
  }>({
    nationalId: null,
    passportPhoto: null,
    otherDocument: null,
  });

  const handleInputChange = (
    field: keyof EditApplicationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentChange = (
    field: keyof EditApplicationFormData["documents"],
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
    field: keyof EditApplicationFormData["documents"],
    file: File
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleDocumentChange(field, result);
      setImagePreview((prev) => ({
        ...prev,
        [field]: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (field: keyof EditApplicationFormData["documents"]) => {
    handleDocumentChange(field, "");
    setImagePreview((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
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

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
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
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
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
                  Citizenship *
                </label>
                <input
                  type="text"
                  required
                  value={formData.citizenship}
                  onChange={(e) => handleInputChange("citizenship", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Education Level *
                </label>
                <select
                  required
                  value={formData.currentEducationLevel}
                  onChange={(e) => handleInputChange("currentEducationLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="High School">High School</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor&apos;s">Bachelor&apos;s</option>
                  <option value="Master&apos;s">Master&apos;s</option>
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
                  <option value="NationalId">National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="DrivingLicense">Driving License</option>
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
              Program & Campus Selection
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
                    <option key={program.programId} value={program.programId}>
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
                    <option key={campus.id} value={campus.id}>
                      {campus.name} - {campus.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any additional information about the application..."
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Reference *
                </label>
                <input
                  type="text"
                  required
                  value={formData.paymentReference}
                  onChange={(e) => handleInputChange("paymentReference", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Document Upload Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* National ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National ID Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview.nationalId ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-32 rounded overflow-hidden">
                          <Image
                            src={imagePreview.nationalId}
                            alt="National ID Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument("nationalId")}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload National ID
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("nationalId", file);
                          }}
                          className="hidden"
                          id="nationalId"
                        />
                        <label
                          htmlFor="nationalId"
                          className="cursor-pointer text-primary hover:text-primary/80 text-sm font-medium"
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview.passportPhoto ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-32 rounded overflow-hidden">
                          <Image
                            src={imagePreview.passportPhoto}
                            alt="Passport Photo Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument("passportPhoto")}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload Passport Photo
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("passportPhoto", file);
                          }}
                          className="hidden"
                          id="passportPhoto"
                        />
                        <label
                          htmlFor="passportPhoto"
                          className="cursor-pointer text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview.otherDocument ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-32 rounded overflow-hidden">
                          <Image
                            src={imagePreview.otherDocument}
                            alt="Other Document Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument("otherDocument")}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload Other Document
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload("otherDocument", file);
                          }}
                          className="hidden"
                          id="otherDocument"
                        />
                        <label
                          htmlFor="otherDocument"
                          className="cursor-pointer text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-3">
          

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-tertiary text-white rounded-lg hover:bg-tertiary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Application"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
