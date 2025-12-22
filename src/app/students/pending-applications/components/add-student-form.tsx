"use client"

import type React from "react"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import type { StudentFormData } from "./add-student-modal"
import type {  Campus } from "@/types/students.types"
import type { Program } from "@/types/programs.types"

interface AddStudentFormProps {
  formData: StudentFormData
  setFormData: React.Dispatch<React.SetStateAction<StudentFormData>>
  onSubmit: (formData: StudentFormData) => void
  programs: Program[]
  campuses: Campus[]
  submitting: boolean
}

export default function AddStudentForm({
  formData,
  setFormData,
  onSubmit,
  programs,
  campuses,
  submitting,
}: AddStudentFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: "nationalId" | "passportPhoto" | "otherDocument",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload PDF, PNG, or JPG files only.")
      e.target.value = ""
      return
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.")
      e.target.value = ""
      return
    }

    // Convert file to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(",")[1] || ""
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docType]: base64String,
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.mobileNumber) {
      toast.error("Please fill in all required fields.")
      return
    }

    if (!formData.programId || !formData.campusId) {
      toast.error("Please select a program and campus.")
      return
    }

    // if (!formData.documents.nationalId || !formData.documents.passportPhoto) {
    //   toast.error("Please upload National ID and Passport Photo.")
    //   return
    // }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program Selection */}
        <div className="space-y-2">
          <label htmlFor="programId" className="block text-sm font-medium text-gray-700">
            Program <span className="text-red-500">*</span>
          </label>
          <select
            id="programId"
            name="programId"
            required
            value={formData.programId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.programId} value={program.programId}>
                {program.code} - {program.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campus Selection */}
        <div className="space-y-2">
          <label htmlFor="campusId" className="block text-sm font-medium text-gray-700">
            Campus <span className="text-red-500">*</span>
          </label>
          <select
            id="campusId"
            name="campusId"
            required
            value={formData.campusId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Campus</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name} - {campus.location}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            required
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+254XXXXXXXXX"
          />
          <p className="text-xs text-gray-500">Format: +254XXXXXXXXX (Kenya)</p>
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Middle Name */}
        <div className="space-y-2">
          <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
            Middle Name <span className="text-red-500">*</span>
          </label>
          <input
            id="middleName"
            name="middleName"
            type="text"
            value={formData.middleName}
            required
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="example@email.com"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Education Level */}
        <div className="space-y-2">
          <label htmlFor="currentEducationLevel" className="block text-sm font-medium text-gray-700">
            Education Level <span className="text-red-500">*</span>
          </label>
          <select
            id="currentEducationLevel"
            name="currentEducationLevel"
            required
            value={formData.currentEducationLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="High School">High School</option>
            <option value="Certificate">Certificate</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's">Bachelor&apos;s Degree</option>
            <option value="Master's">Master&apos;s Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* Citizenship */}
        <div className="space-y-2">
          <label htmlFor="citizenship" className="block text-sm font-medium text-gray-700">
            Citizenship <span className="text-red-500">*</span>
          </label>
          <input
            id="citizenship"
            name="citizenship"
            type="text"
            required
            value={formData.citizenship}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Identity Type */}
        <div className="space-y-2">
          <label htmlFor="identityType" className="block text-sm font-medium text-gray-700">
            Identity Type <span className="text-red-500">*</span>
          </label>
          <select
            id="identityType"
            name="identityType"
            required
            value={formData.identityType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Identity Type</option>
            <option value="NationalId">National ID</option>
            <option value="Passport">Passport</option>
          </select>
        </div>

        {/* Identity Number */}
        <div className="space-y-2">
          <label htmlFor="identityNumber" className="block text-sm font-medium text-gray-700">
            Identity Number <span className="text-red-500">*</span>
          </label>
          <input
            id="identityNumber"
            name="identityNumber"
            type="text"
            required
            value={formData.identityNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter identity number"
          />
        </div>

        {/* Documents Upload */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Documents <span className="text-gray-400">(Optional)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="nationalId" className="block text-sm text-gray-600">
                National ID <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="nationalId"
                name="nationalId"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, "nationalId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500">Accepted formats: PDF, PNG, JPG (Max 5MB)</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="passportPhoto" className="block text-sm text-gray-600">
                Passport Photo <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="passportPhoto"
                name="passportPhoto"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, "passportPhoto")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500">Accepted formats: PDF, PNG, JPG (Max 5MB)</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="otherDocument" className="block text-sm text-gray-600">
                Other Document <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="otherDocument"
                name="otherDocument"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, "otherDocument")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500">Accepted formats: PDF, PNG, JPG (Max 5MB)</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
            Additional Information <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            placeholder="Any special considerations or additional information"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors flex items-center"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Adding Student...
            </>
          ) : (
            "Add Student"
          )}
        </button>
      </div>
    </form>
  )
}
