"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { applicationsService } from "@/services/applications.api";
import { programsService } from "@/services/programs.api";
import { studentsService } from "@/services/students.api";
import EditStudentForm from "./edit-student-form";
import type { Student } from "@/types/students.types";
import type { Program } from "@/types/programs.types";
import type { Campus } from "@/types/campuses.types";
import type { Document } from "@/types/applications.types";

export interface EditStudentFormData {
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
  paymentReference: string;
  documents: {
    nationalId: string;
    passportPhoto: string;
    otherDocument: string;
  };
  applicantId: string;
  enrollmentStatus: string;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: Student | null;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  onSuccess,
  student,
}: EditStudentModalProps) {
  const [formData, setFormData] = useState<EditStudentFormData>({
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
    paymentReference: "",
    documents: {
      nationalId: "",
      passportPhoto: "",
      otherDocument: "",
    },
    applicantId: "",
    enrollmentStatus: "ENROLLED",
  });
  const [programs, setPrograms] = useState<Program[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const populateFormData = useCallback(() => {
    if (!student) return;

    setFormData({
      mobileNumber: student.applicant.mobile,
      firstName: student.applicant.firstName,
      middleName: "", // Not available in Student type
      lastName: student.applicant.lastName,
      email: student.applicant.email,
      gender: student.applicant.gender,
      dateOfBirth: student.applicant.dob,
      identityType: student.applicant.documentType,
      identityNumber: student.applicant.documentNumber.toString(),
      citizenship: student.applicant.citizenship,
      currentEducationLevel: student.applicant.currentEducationLevel,
      additionalInfo: "", // Not available in Student type
      programId: student.application.program.programId.toString(),
      campusId: student.application.campus.id.toString(),
      paymentReference: student.application.paymentReference || "",
      documents: {
        nationalId: "",
        passportPhoto: "",
        otherDocument: "",
      },
      applicantId: student.applicant.applicantId.toString(),
      enrollmentStatus: student.enrollmentStatus,
    });
  }, [student]);

  const fetchProgramsAndCampuses = async () => {
    try {
      setLoading(true);
      const [programsData, campusesData] = await Promise.all([
        programsService.getPrograms(),
        studentsService.getCampuses(),
      ]);
      setPrograms(programsData);
      setCampuses(campusesData);
    } catch (error) {
      console.error("Error fetching programs and campuses:", error);
      toast.error("Failed to load programs and campuses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (applicantId: number) => {
    try {
      setDocumentsLoading(true);
      const documents: Document[] = await applicationsService.getApplicantDocuments(applicantId);
      
      // Map documents to form fields based on documentType
      const mappedDocuments = {
        nationalId: "",
        passportPhoto: "",
        otherDocument: "",
      };
      
      documents.forEach((doc) => {
        switch (doc.documentType) {
          case "NATIONAL_ID":
            mappedDocuments.nationalId = doc.content;
            break;
          case "PASSPORT_PHOTO":
            mappedDocuments.passportPhoto = doc.content;
            break;
          case "OTHER":
            mappedDocuments.otherDocument = doc.content;
            break;
        }
      });

      // Update formData with fetched documents
      setFormData((prev) => ({
        ...prev,
        documents: mappedDocuments,
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Continue with empty documents if fetch fails
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && student) {
      const loadData = async () => {
        await fetchProgramsAndCampuses();
        populateFormData();
        // Fetch documents after populating form data
        await fetchDocuments(student.applicant.applicantId);
      };
      loadData();
    }
  }, [isOpen, student, populateFormData]);

  const handleSubmit = async () => {
    if (!student) return;

    if (!formData.firstName || !formData.lastName || !formData.mobileNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        programId: parseInt(formData.programId),
        admissionCycleId: null,
        campusId: parseInt(formData.campusId),
        additionalInfo: formData.additionalInfo,
        paymentReference: formData.paymentReference,
        applicantInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || "",
          mobile: formData.mobileNumber,
          dob: formData.dateOfBirth,
          citizenship: formData.citizenship,
          currentEducationLevel: formData.currentEducationLevel,
          documentType: formData.identityType,
          documentNumber: formData.identityNumber,
          gender: formData.gender,
        },
        documents: [] as Array<{
          documentType: string;
          content: string;
        }>,
        applicantId: parseInt(formData.applicantId),
      };

      // Add documents if provided
      if (formData.documents.nationalId) {
        payload.documents.push({
          documentType: "NATIONAL_ID",
          content: formData.documents.nationalId,
        });
      }

      if (formData.documents.passportPhoto) {
        payload.documents.push({
          documentType: "PASSPORT_PHOTO",
          content: formData.documents.passportPhoto,
        });
      }

      if (formData.documents.otherDocument) {
        payload.documents.push({
          documentType: "OTHER",
          content: formData.documents.otherDocument,
        });
      }

      await applicationsService.updateApplication(student.application.applicationId, payload);
      toast.success("Student updated successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student. Please try again.");
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
      paymentReference: "",
      documents: {
        nationalId: "",
        passportPhoto: "",
        otherDocument: "",
      },
      applicantId: "",
      enrollmentStatus: "ENROLLED",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && student && (
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
            className="relative z-10 w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Edit Student - {student.applicant.firstName} {student.applicant.lastName}
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
              <EditStudentForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                programs={programs}
                campuses={campuses}
                submitting={submitting}
                documentsLoading={documentsLoading}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
