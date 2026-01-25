"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SearchableSelect from "@/app/components/common/SearchableSelect";

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


  const handleInputChange = (
    field: keyof EditApplicationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
    { number: 3, title: "Payment Information" },
  ];

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-1">
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
                <SearchableSelect
                  options={[{ value: "", label: "Select Gender" }, { value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]}
                  value={formData.gender || null}
                  onChange={(v: string | number | null) => handleInputChange("gender", v?.toString() ?? "") }
                  placeholder="Select Gender"
                  className="w-full"
                />
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
                <SearchableSelect
                  options={[
                    { value: "High School", label: "High School" },
                    { value: "Diploma", label: "Diploma" },
                    { value: "Bachelor's", label: "Bachelor's" },
                    { value: "Master's", label: "Master's" },
                    { value: "PhD", label: "PhD" },
                  ]}
                  value={formData.currentEducationLevel || null}
                  onChange={(v: string | number | null) => handleInputChange("currentEducationLevel", v?.toString() ?? "") }
                  placeholder="Select Education Level"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identity Type
                </label>
                <SearchableSelect
                  options={[{ value: "NationalId", label: "National ID" }, { value: "Passport", label: "Passport" }, { value: "DrivingLicense", label: "Driving License" }]}
                  value={formData.identityType || null}
                  onChange={(v: string | number | null) => handleInputChange("identityType", v?.toString() ?? "") }
                  placeholder="Select Identity Type"
                  className="w-full"
                />
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
                <SearchableSelect
                  options={[{ value: "", label: "Select Program" }, ...programs.map((p) => ({ value: p.programId.toString(), label: `${p.name} - ${p.code}` }))]}
                  value={formData.programId || null}
                  onChange={(v: string | number | null) => handleInputChange("programId", v?.toString() ?? "") }
                  className="w-full"
                  placeholder="Select Program"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus *
                </label>
                <SearchableSelect
                  options={[{ value: "", label: "Select Campus" }, ...campuses.map((c) => ({ value: c.id.toString(), label: `${c.name} - ${c.location}` }))]}
                  value={formData.campusId || null}
                  onChange={(v: string | number | null) => handleInputChange("campusId", v?.toString() ?? "") }
                  className="w-full"
                  placeholder="Select Campus"
                />
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
              Payment Information
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
