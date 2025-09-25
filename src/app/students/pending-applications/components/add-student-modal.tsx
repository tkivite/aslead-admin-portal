"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import AddStudentForm from "./add-student-fotm";
import type { Program, Campus } from "@/types/students.types";
import { studentsService } from "@/services/students.api";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface StudentFormData {
  mobileNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  identityType: string;
  identityNumber: string;
  citizenship: string;
  currentEducationLevel: string;
  additionalInfo: string;
  programId: string;
  campusId: string;
  documents: {
    nationalId: string;
    passportPhoto: string;
    otherDocument: string;
  };
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onSuccess,
}: AddStudentModalProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    mobileNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    identityType: "",
    identityNumber: "",
    citizenship: "Kenya",
    currentEducationLevel: "High School",
    additionalInfo: "",
    programId: "",
    campusId: "",
    documents: {
      nationalId: "",
      passportPhoto: "",
      otherDocument: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      fetchCampuses();
    }
  }, [isOpen]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const programs = await studentsService.getPrograms();
      setPrograms(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCampuses = async () => {
    try {
      const campuses = await studentsService.getCampuses();
      setCampuses(campuses);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      toast.error("Failed to load campuses. Please try again.");
    }
  };

  const handleSubmit = async (studentData: StudentFormData) => {
    setSubmitting(true);

    try {
      // Prepare the payload
      const payload = {
        programId: Number.parseInt(studentData.programId),
        campusId: Number.parseInt(studentData.campusId),
        additionalInfo: studentData.additionalInfo || "Added by admin",
        paymentReference: `ADMIN_${Date.now()}`,
        applicantInfo: {
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email || null,
          mobile: studentData.mobileNumber,
          dob: studentData.dateOfBirth,
          gender: studentData.gender,
          citizenship: studentData.citizenship,
          currentEducationLevel: studentData.currentEducationLevel,
          documentType: studentData.identityType,
          documentNumber: studentData.identityNumber,
        },
        documents: [] as Array<{
          documentType: string;
          content: string;
          status: "PENDING";
        }>,
      };

      // Add documents if provided
      if (studentData.documents.nationalId) {
        payload.documents.push({
          documentType: "NATIONAL_ID",
          content: studentData.documents.nationalId,
          status: "PENDING",
        });
      }

      if (studentData.documents.passportPhoto) {
        payload.documents.push({
          documentType: "PASSPORT_PHOTO",
          content: studentData.documents.passportPhoto,
          status: "PENDING",
        });
      }

      if (studentData.documents.otherDocument) {
        payload.documents.push({
          documentType: "OTHER",
          content: studentData.documents.otherDocument,
          status: "PENDING",
        });
      }

      await studentsService.addStudent(payload);

      toast.success("Student added successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error adding student:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      mobileNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      identityType: "",
      identityNumber: "",
      citizenship: "Kenya",
      currentEducationLevel: "High School",
      additionalInfo: "",
      programId: "",
      campusId: "",
      documents: {
        nationalId: "",
        passportPhoto: "",
        otherDocument: "",
      },
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Add New Student
              </h3>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-600">
                  Loading programs and campuses...
                </span>
              </div>
            ) : (
              <AddStudentForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                programs={programs}
                campuses={campuses}
                submitting={submitting}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
