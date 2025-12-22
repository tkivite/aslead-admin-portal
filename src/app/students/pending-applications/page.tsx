"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  GraduationCap,
  Check,
  Plus,
  Edit,
} from "lucide-react";
import DataTable from "@/app/components/common/DataTable";
import TableFilters, { FilterOptions } from "@/app/components/common/TableFilters";
import type { Application, Document } from "@/types/applications.types";
import type { Campus } from "@/types/students.types";
import type { Program } from "@/types/programs.types";
import AddStudentModal from "./components/add-student-modal";
import ApprovalModal from "./components/approval-modal";
import EditApplicationModal from "./components/edit-application-modal";
import { exportApplicationsToCSV } from "@/utils/csvExport";
import { applicationsService } from "@/services/applications.api";
import { studentsService } from "@/services/students.api";
import DocumentsViewer from "@/app/components/common/DocumentsViewer";
import DocumentsEditor from "@/app/components/common/DocumentsEditor";

export default function PendingApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [approvingIds, setApprovingIds] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [docEditorOpen, setDocEditorOpen] = useState(false);
  const [docEditorApp, setDocEditorApp] = useState<Application | null>(null);
  const [docCache, setDocCache] = useState<Record<number, Document[]>>({});
  const [filters, setFilters] = useState<FilterOptions>({});
  const [programs, setPrograms] = useState<Program[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await applicationsService.getPaginatedApplications(
        currentPage,
        10,
        "PENDING",
        filters
      );
      setApplications(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Error fetching pending applications:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);


  useEffect(() => {
    fetchApplications();
    fetchProgramsAndCampuses();
  }, [fetchApplications]);

  const fetchProgramsAndCampuses = async () => {
    try {
      const [programsData, campusesData] = await Promise.all([
        studentsService.getPrograms(),
        studentsService.getCampuses(),
      ]);
      setPrograms(programsData);
      setCampuses(campusesData);
    } catch (error) {
      console.error("Error fetching programs and campuses:", error);
    }
  };

  const handleApproveClick = (application: Application) => {
    setSelectedApplication(application);
    setShowApprovalModal(true);
  };

  const handleEditClick = (application: Application) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  const handleApproveApplication = async (startYear: number, startMonth: string) => {
    if (!selectedApplication) return;

    try {
      setApprovingIds((prev) => new Set(prev).add(selectedApplication.applicationId));

      await applicationsService.approveApplication(
        selectedApplication?.applicant?.applicantId,
        selectedApplication.applicationId,
        startYear,
        startMonth
      );

      // Remove the approved application from the current list
      setApplications((prev) =>
        prev.filter((app) => app.applicationId !== selectedApplication.applicationId)
      );

      // Update total elements count
      setTotalElements((prev) => prev - 1);

      // If current page becomes empty and it's not the first page, go to previous page
      if (applications.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      } else {
        // Refresh the current page to get updated data
        fetchApplications();
      }

      // Close the modal
      setShowApprovalModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error approving application:", error);
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedApplication.applicationId);
        return newSet;
      });
    }
  };
  const handleAddStudentSuccess = () => {
    fetchApplications(); // Refresh the students list
  };

  const handleEditApplicationSuccess = () => {
    fetchApplications(); // Refresh the applications list
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns = [
    {
      key: "applicant",
      label: "Applicant",
      render: (app: Application) => (
        <div>
          <div className="text-sm font-medium text-textDark">
            {app?.applicant?.firstName} {app?.applicant?.lastName}
          </div>
          <div className="text-xs text-gray-500">{app?.applicant?.email}</div>
        </div>
      ),
    },
    {
      key: "program",
      label: "Program",
      render: (app: Application) => (
        <div>
          <div className="text-sm font-medium text-textDark">
            {app.program.code}
          </div>
          <div className="text-xs text-gray-500">{app.program.name}</div>
        </div>
      ),
    },
    {
      key: "campus",
      label: "Campus",
      render: (app: Application) => (
        <span className="text-sm text-gray-600">{app.campus.name}</span>
      ),
    },
    {
      key: "feeAmount",
      label: "Fee Amount",
      render: (app: Application) => (
        <span className="text-sm font-medium text-tertiary">
          KES {app.feeAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (app: Application) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent">
          {app.status}
        </span>
      ),
    },
    {
      key: "submittedAt",
      label: "Submitted",
      render: (app: Application) => (
        <span className="text-sm text-gray-600">
          {formatDate(app.submittedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (app: Application) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(app);
            }}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApproveClick(app);
            }}
            disabled={approvingIds.has(app.applicationId)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-tertiary rounded-md hover:bg-tertiary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {approvingIds.has(app.applicationId) ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Approving...
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                Approve
              </>
            )}
          </button>
        </div>
      ),
    },
  ];

  const expandableRow = (app: Application) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <User className="h-4 w-4" />
          Personal Details
        </h4>
        <div className="text-sm space-y-1">
          <p className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span className="font-medium">Mobile:</span> {app?.applicant?.mobile}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span className="font-medium">Email:</span> {app?.applicant?.email}
          </p>
          <p>
            <span className="font-medium">DOB:</span>{" "}
            {formatDate(app?.applicant?.dob)}
          </p>
          <p>
            <span className="font-medium">Education:</span>{" "}
            {app?.applicant?.currentEducationLevel}
          </p>
          <p>
            <span className="font-medium">Citizenship:</span>{" "}
            {app?.applicant?.citizenship}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Program Details
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Duration:</span>{" "}
            {app.program.durationMonths} months
          </p>
          <p>
            <span className="font-medium">Tuition:</span> KES{" "}
            {app.program.tuitionFee.toLocaleString()}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="font-medium">Campus:</span> {app.campus.location}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Status
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Fee Status:</span>
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                app?.feePaymentStatus === "PAID"
                  ? "bg-tertiary/10 text-tertiary"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {app?.feePaymentStatus.replace("_", " ")}
            </span>
          </p>
          <p>
            <span className="font-medium">Reference:</span>{" "}
            {app.paymentReference || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span className="font-medium">Applied:</span>{" "}
            {formatDate(app.createdAt)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <DocumentsViewer
            applicantId={app?.applicant?.applicantId}
            applicantName={`${app.applicant?.firstName} ${app?.applicant?.lastName}`}
            onDocumentsFetched={(docs) => setDocCache((prev) => ({ ...prev, [app.applicationId]: docs }))}
            initialDocuments={docCache[app.applicationId]}
          />
          <button
            onClick={() => {
              setDocEditorApp(app);
              setDocEditorOpen(true);
            }}
            className="px-3 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Edit Documents
          </button>
        </div>
      </div>
    </div>
  );

  const handleExport = () => {
    exportApplicationsToCSV(applications);
  };

  return (
    <div className="space-y-2">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div />
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TableFilters
          onFiltersChange={setFilters}
          showStatusFilter={false}
          showDateRangeFilter={true}
          showSearchFilter={true}
          showSortFilter={true}
          showCampusFilter={true}
          showProgramFilter={true}
          campusOptions={campuses.map((campus) => ({
            value: campus.id,
            label: `${campus.name} - ${campus.location}`,
          }))}
          programOptions={programs.map((program) => ({
            value: program.programId,
            label: `${program.name} - ${program.code}`,
          }))}
          sortOptions={[
            { value: "createdAt", label: "Created Date" },
            { value: "updatedAt", label: "Updated Date" },
            { value: "firstName", label: "First Name" },
            { value: "lastName", label: "Last Name" },
          ]}
        />

        <DataTable
          data={applications}
          columns={columns}
          loading={loading}
          expandableRow={expandableRow}
          pagination={{
            currentPage,
            totalPages,
            totalElements,
            onPageChange: setCurrentPage,
          }}
          onExport={handleExport}
          title={`Pending Applications (${totalElements})`}
        />
      </motion.div>

      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddStudentSuccess}
      />

      <DocumentsEditor
        isOpen={docEditorOpen}
        onClose={() => {
          setDocEditorOpen(false);
          setDocEditorApp(null);
        }}
        onSuccess={() => {
          fetchApplications();
          setDocEditorOpen(false);
          setDocEditorApp(null);
        }}
        applicantId={docEditorApp?.applicant?.applicantId ?? 0}
        applicationId={docEditorApp?.applicationId ?? 0}
        applicantInfo={docEditorApp?.applicant}
        programId={docEditorApp?.program?.programId ?? 0}
        campusId={docEditorApp?.campus?.id ?? 0}
        paymentReference={docEditorApp?.paymentReference}
        initialDocuments={docEditorApp ? docCache[docEditorApp.applicationId] : undefined}
        onDocumentsUpdated={(docs) => {
          if (docEditorApp) {
            setDocCache((prev) => ({ ...prev, [docEditorApp.applicationId]: docs }));
          }
        }}
      />

      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedApplication(null);
        }}
        onConfirm={handleApproveApplication}
        application={selectedApplication}
        isSubmitting={selectedApplication ? approvingIds.has(selectedApplication.applicationId) : false}
      />

      <EditApplicationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedApplication(null);
        }}
        onSuccess={handleEditApplicationSuccess}
        application={selectedApplication}
      />
    </div>
  )
}
