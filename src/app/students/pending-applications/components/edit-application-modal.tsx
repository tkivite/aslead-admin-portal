"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import EditApplicationForm from "./edit-application-form";
import type {  Campus } from "@/types/students.types";
import type { Program } from "@/types/programs.types";
import type { Application } from "@/types/applications.types";
import { studentsService } from "@/services/students.api";
import { applicationsService } from "@/services/applications.api";

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  application: Application | null;
}

export interface EditApplicationFormData {
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
  applicantId:string
}

export default function EditApplicationModal({
  isOpen,
  onClose,
  onSuccess,
  application,
}: EditApplicationModalProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditApplicationFormData>({
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
    applicantId:""
  });

  const populateFormData = useCallback(() => {
    if (!application) return;

    setFormData({
      mobileNumber: application?.applicant?.mobile,
      firstName: application?.applicant?.firstName,
      middleName: "", // Not available in Application type
      lastName: application?.applicant?.lastName,
      email: application?.applicant?.email,
      gender: application?.applicant?.gender,
      dateOfBirth: application?.applicant?.dob,
      identityType: application?.applicant?.documentType,
      identityNumber: application?.applicant?.documentNumber.toString(),
      citizenship: application?.applicant?.citizenship,
      currentEducationLevel: application?.applicant?.currentEducationLevel,
      additionalInfo: "", // Not available in Application type
      programId: application.program.programId.toString(),
      campusId: application.campus.id.toString(),
      applicantId:application?.applicant.applicantId?.toString(),
      paymentReference: application.paymentReference,
      documents: {
        nationalId: "",
        passportPhoto: "",
        otherDocument: "",
      },
    });
  }, [application]);

  useEffect(() => {
    if (isOpen && application) {
      fetchPrograms();
      fetchCampuses();
      populateFormData();
    }
  }, [isOpen, application, populateFormData]);

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

  const handleSubmit = async (applicationData: EditApplicationFormData) => {
    if (!application) return;

    setSubmitting(true);

    try {
      // Prepare the payload
      const payload = {
        programId: Number.parseInt(applicationData.programId),
        admissionCycleId: null,
        campusId: Number.parseInt(applicationData.campusId),
        applicantId:Number.parseInt(applicationData.applicantId),
        additionalInfo: applicationData.additionalInfo || "Updated by admin",
        paymentReference: applicationData.paymentReference,
        applicantInfo: {
          firstName: applicationData.firstName,
          lastName: applicationData.lastName,
          email: applicationData.email || "",
          mobile: applicationData.mobileNumber,
          dob: applicationData.dateOfBirth,
          citizenship: applicationData.citizenship,
          currentEducationLevel: applicationData.currentEducationLevel,
          documentType: applicationData.identityType,
          documentNumber: applicationData.identityNumber,
          gender:applicationData.gender
        },
        documents: [] as Array<{
          documentType: string;
          content: string;
        }>,
         
      };

      // Add documents if provided
      if (applicationData.documents.nationalId) {
        payload.documents.push({
          documentType: "NATIONAL_ID",
          content: applicationData.documents.nationalId,
        });
      }

      if (applicationData.documents.passportPhoto) {
        payload.documents.push({
          documentType: "PASSPORT_PHOTO",
          content: applicationData.documents.passportPhoto,
        });
      }

      if (applicationData.documents.otherDocument) {
        payload.documents.push({
          documentType: "OTHER",
          content: applicationData.documents.otherDocument,
        });
      }

      await applicationsService.updateApplication(application.applicationId, payload);

      toast.success("Application updated successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application. Please try again.");
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
      applicantId:""
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && application && (
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
                Edit Application - {application?.applicant?.firstName} {application?.applicant?.lastName}
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
              <EditApplicationForm
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
