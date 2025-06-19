import { MpesaPayment } from "@/types/payments.types"
import { Application } from "@/types/applications.types"
import { Payment } from "@/types/payments.types"
import { Student } from "@/types/students.types"

export function exportToCSV<T extends Record<string, unknown>>(data: T[], filename: string, columns?: string[]) {
  if (!data.length) return

  // Get headers - either from columns prop or from first data item
  const headers = columns || Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(","),
    // Data rows
    ...data.map((item) =>
      headers
        .map((header) => {
          const value = getNestedValue(item, header)
          // Escape commas and quotes in values
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ""
        })
        .join(","),
    ),
  ].join("\n")

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Helper function to get nested object values
// Helper function to get nested object values
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((current: unknown, key: string) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}
// Specific export functions for different data types
export function exportApplicationsToCSV(applications: Application[]) {
  const flattenedData = applications.map((app) => ({
    "Application ID": app.applicationId,
    "First Name": app.applicant.firstName,
    "Last Name": app.applicant.lastName,
    Email: app.applicant.email,
    Mobile: app.applicant.mobile,
    "Program Code": app.program.code,
    "Program Name": app.program.name,
    Campus: app.campus.name,
    Status: app.status,
    "Fee Amount": app.feeAmount,
    "Payment Status": app.feePaymentStatus,
    "Submitted At": new Date(app.submittedAt).toLocaleDateString(),
  }))

  exportToCSV(flattenedData, "applications")
}

export function exportStudentsToCSV(students:Student[]) {
  const flattenedData = students.map((student) => ({
    "Student ID": student.studentId,
    "First Name": student.applicant.firstName,
    "Last Name": student.applicant.lastName,
    Email: student.applicant.email,
    Mobile: student.applicant.mobile,
    "Program Code": student.application.program.code,
    "Program Name": student.application.program.name,
    Campus: student.application.campus.name,
    "Enrollment Status": student.enrollmentStatus,
    "Enrolled At": new Date(student.enrolledAt).toLocaleDateString(),
  }))

  exportToCSV(flattenedData, "students")
}

export function exportPaymentsToCSV(payments: Payment[]) {
  const flattenedData = payments.map((payment) => ({
    "Payment ID": payment.id,
    From: payment.receivedFrom,
    Mobile: payment.mobileNumber,
    Reference: payment.reference,
    Amount: payment.amount,
    Channel: payment.channel,
    "Payment Mode": payment.paymentMode,
    Description: payment.description,
    "Created At": new Date(payment.createdAt).toLocaleDateString(),
  }))

  exportToCSV(flattenedData, "payments")
}

export function exportMpesaPaymentsToCSV(payments: MpesaPayment[]) {
  const flattenedData = payments.map((payment) => ({
    "Transaction ID": payment.TransID,
    "First Name": payment.FirstName,
    "Transaction Type": payment.TransactionType,
    Amount: payment.TransAmount,
    "Bill Reference": payment.BillRefNumber,
    "Transaction Time": payment.TransTime,
    "Account Balance": payment.OrgAccountBalance,
    "Created At": new Date(payment.createdAt).toLocaleDateString(),
  }))

  exportToCSV(flattenedData, "mpesa-payments")
}
