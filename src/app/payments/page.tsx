"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  RefreshCw,
  Eye,
  Link2,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import type { Student, UnmatchedPayment } from "@/types/api.types"

// Mock data for payments (will be replaced with API data)
const paymentsData = [
  {
    id: "PAY-001245",
    student: "John Doe",
    course: "Leadership Development",
    amount: 1200,
    date: "2023-05-15",
    method: "M-Pesa",
    reference: "MPESA7845123",
    status: "Confirmed",
  },
  {
    id: "PAY-001246",
    student: "Jane Smith",
    course: "Ethical Leadership",
    amount: 950,
    date: "2023-05-14",
    method: "Bank Transfer",
    reference: "BT98765432",
    status: "Pending",
  },
  {
    id: "PAY-001247",
    student: "Michael Johnson",
    course: "Management Skills",
    amount: 1100,
    date: "2023-05-13",
    method: "Cash",
    reference: "CASH001247",
    status: "Confirmed",
  },
  {
    id: "PAY-001248",
    student: "Sarah Williams",
    course: "Communication Skills",
    amount: 850,
    date: "2023-05-12",
    method: "M-Pesa",
    reference: "MPESA7845789",
    status: "Failed",
  },
  {
    id: "PAY-001249",
    student: "Robert Brown",
    course: "Leadership Development",
    amount: 1200,
    date: "2023-05-11",
    method: "Credit Card",
    reference: "CC78451234",
    status: "Confirmed",
  },
  {
    id: "PAY-001250",
    student: "Emily Davis",
    course: "Ethical Leadership",
    amount: 950,
    date: "2023-05-10",
    method: "M-Pesa",
    reference: "MPESA7845456",
    status: "Confirmed",
  },
  {
    id: "PAY-001251",
    student: "David Wilson",
    course: "Management Skills",
    amount: 1100,
    date: "2023-05-09",
    method: "Bank Transfer",
    reference: "BT12345678",
    status: "Pending",
  },
  {
    id: "PAY-001252",
    student: "Jennifer Taylor",
    course: "Communication Skills",
    amount: 850,
    date: "2023-05-08",
    method: "M-Pesa",
    reference: "MPESA7845987",
    status: "Confirmed",
  },
]

// Mock unmatched payments data (will be replaced with API data)
const unmatchedPaymentsData: UnmatchedPayment[] = [
  {
    paymentId: 1001,
    reference: "MPESA7845123",
    transactionId: "OFG78451234",
    phoneNumber: "254712345678",
    amount: 1200,
    paymentMethod: "M-Pesa",
    paymentDate: "2023-05-15 14:30:45",
    status: "Unmatched",
    matched: false,
  },
  {
    paymentId: 1002,
    reference: "BT98765432",
    transactionId: "BT98765432",
    phoneNumber: "N/A",
    amount: 950,
    paymentMethod: "Bank Transfer",
    paymentDate: "2023-05-14 09:15:22",
    status: "Unmatched",
    matched: false,
  },
  {
    paymentId: 1003,
    reference: "MPESA7845789",
    transactionId: "OFG78457890",
    phoneNumber: "254723456789",
    amount: 850,
    paymentMethod: "M-Pesa",
    paymentDate: "2023-05-12 16:45:33",
    status: "Unmatched",
    matched: false,
  },
]

// Mock students data for search (will be replaced with API data)
const studentsData: Student[] = [
  {
    studentId: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    registrationNumber: "STD-2023-001",
  },
  {
    studentId: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    registrationNumber: "STD-2023-002",
  },
  {
    studentId: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    registrationNumber: "STD-2023-003",
  },
  {
    studentId: 4,
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    registrationNumber: "STD-2023-004",
  },
]

// Payment methods for filtering
const paymentMethods = ["All Methods", "M-Pesa", "Bank Transfer", "Cash", "Credit Card"]

// Payment statuses for filtering
const paymentStatuses = ["All Statuses", "Confirmed", "Pending", "Failed", "Unmatched"]

export default function PaymentsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("All Methods")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showReconcileForm, setShowReconcileForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const paymentsPerPage = 5

  // State for API data

  const [unmatchedPayments, setUnmatchedPayments] = useState<UnmatchedPayment[]>([])
  const [loading, setLoading] = useState(false)

  // State for reconciliation
  const [selectedPayment, setSelectedPayment] = useState<UnmatchedPayment | null>(null)
  const [studentSearchTerm, setStudentSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [reconciliationNote, setReconciliationNote] = useState("")
  const [searchingStudents, setSearchingStudents] = useState(false)
  const [reconciliationStep, setReconciliationStep] = useState(1)

  // Fetch payments data
  useEffect(() => {
    // In a real implementation, we would fetch from the API
    // For now, we'll use the mock data
    // Example API call:
    // const fetchPayments = async () => {
    //   try {
    //     setLoading(true);
    //     const data = await paymentsService.getPayments();
    //     setPayments(data.content);
    //   } catch (err) {
    //     setError("Failed to fetch payments");
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPayments();
  }, [])

  // Fetch unmatched payments when reconcile form is opened
  useEffect(() => {
    if (showReconcileForm) {
      // In a real implementation, we would fetch from the API
      // For now, we'll use the mock data
      setUnmatchedPayments(unmatchedPaymentsData)

      // Example API call:
      // const fetchUnmatchedPayments = async () => {
      //   try {
      //     setLoading(true);
      //     const data = await paymentsService.getUnmatchedPayments();
      //     setUnmatchedPayments(data.content);
      //   } catch (err) {
      //     setError("Failed to fetch unmatched payments");
      //     console.error(err);
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchUnmatchedPayments();
    }
  }, [showReconcileForm])

  // Search students when the search term changes
  useEffect(() => {
    if (studentSearchTerm.length < 2) {
      setSearchResults([])
      return
    }

    const searchStudents = async () => {
      setSearchingStudents(true)
      try {
        // In a real implementation, we would fetch from the API
        // For now, we'll filter the mock data
        const results = studentsData.filter(
          (student) =>
            student.firstName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
            student.registrationNumber.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(studentSearchTerm.toLowerCase()),
        )
        setSearchResults(results)

        // Example API call:
        // const results = await paymentsService.searchStudents(studentSearchTerm);
        // setSearchResults(results);
      } catch (err) {
        console.error("Error searching students:", err)
      } finally {
        setSearchingStudents(false)
      }
    }

    // Debounce the search
    const handler = setTimeout(() => {
      searchStudents()
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [studentSearchTerm])

  // Filter payments based on search term and filters
  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch =
      payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMethod = selectedMethod === "All Methods" || payment.method === selectedMethod

    const matchesStatus = selectedStatus === "All Statuses" || payment.status === selectedStatus

    const matchesDateRange = (!startDate || payment.date >= startDate) && (!endDate || payment.date <= endDate)

    return matchesSearch && matchesMethod && matchesStatus && matchesDateRange
  })

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment)
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage)

  // Handle export data to CSV
  const handleExportData = () => {
    // Create CSV content
    const headers = ["Payment ID", "Student", "Course", "Amount", "Date", "Method", "Reference", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredPayments.map((payment) =>
        [
          `"${payment.id}"`,
          `"${payment.student}"`,
          `"${payment.course}"`,
          `"${payment.amount}"`,
          `"${payment.date}"`,
          `"${payment.method}"`,
          `"${payment.reference}"`,
          `"${payment.status}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `payments_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle view payment
  const handleViewPayment = (paymentId: string) => {
    router.push(`/payments/${paymentId}`)
  }

  // Handle view receipt
  const handleViewReceipt = (paymentId: string) => {
    router.push(`/payments/receipt/${paymentId}`)
  }

  // Handle selecting a payment for reconciliation
  const handleSelectPayment = (payment: UnmatchedPayment) => {
    setSelectedPayment(payment)
    setReconciliationStep(2)
  }

  // Handle selecting a student for reconciliation
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student)
    setReconciliationStep(3)
  }

  // Handle reconciliation submission
  const handleReconcileSubmit = async () => {
    if (!selectedPayment || !selectedStudent) return

    try {
      setLoading(true)

      // In a real implementation, we would call the API
      // For now, we'll just simulate success
      console.log("Reconciling payment:", {
        paymentId: selectedPayment.paymentId,
        studentId: selectedStudent.studentId,
        description: reconciliationNote,
      })

      // Example API call:
      // await paymentsService.reconcilePayment({
      //   paymentId: selectedPayment.paymentId,
      //   studentId: selectedStudent.studentId,
      //   description: reconciliationNote
      // });

      // Update the UI to reflect the change
      setUnmatchedPayments((prev) =>
        prev.map((p) => (p.paymentId === selectedPayment.paymentId ? { ...p, matched: true, status: "Matched" } : p)),
      )

      // Reset the form
      setReconciliationStep(1)
      setSelectedPayment(null)
      setSelectedStudent(null)
      setStudentSearchTerm("")
      setSearchResults([])
      setReconciliationNote("")

      // Show success message
      alert("Payment successfully reconciled!")
    } catch (err) {
      console.error("Error reconciling payment:", err)
      alert("Failed to reconcile payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Pending":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Failed":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Unmatched":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            <AlertCircle size={12} className="mr-1" />
            {status}
          </span>
        )
      case "Matched":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            <CheckCircle size={12} className="mr-1" />
            {status}
          </span>
        )
      default:
        return <span>{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-textDark">Payments</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => setShowReconcileForm(true)} className="btn-tertiary flex items-center justify-center">
            <RefreshCw size={18} className="mr-2" />
            Reconcile Payments
          </button>
          <button onClick={handleExportData} className="btn-secondary flex items-center justify-center">
            <Download size={18} className="mr-2" />
            Export Data
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by student, payment ID, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-backgroundsecondary rounded-md hover:bg-gray-200 transition-colors"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Payment Method</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="input-field"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
            </div>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-backgroundsecondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-backgroundsecondary"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textDark">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{payment.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{payment.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">${payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{payment.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{payment.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPayment(payment.id)}
                        className="text-tertiary hover:text-primary transition-colors"
                      >
                        <Eye size={16} className="mr-1 inline" />
                        View
                      </button>
                      <button
                        onClick={() => handleViewReceipt(payment.id)}
                        className="text-tertiary hover:text-primary transition-colors"
                      >
                        <FileText size={16} className="mr-1 inline" />
                        Receipt
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstPayment + 1} to {Math.min(indexOfLastPayment, filteredPayments.length)} of{" "}
            {filteredPayments.length} payments
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-backgroundsecondary hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-md bg-backgroundsecondary hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Reconcile Payments Modal */}
      {showReconcileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Reconcile Payments</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Step {reconciliationStep} of 3</span>
                <button onClick={() => setShowReconcileForm(false)} className="text-gray-500 hover:text-gray-700">
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Step 1: Select Payment */}
              {reconciliationStep === 1 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Step 1: Select an Unmatched Payment</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select a payment from the list below to reconcile it with a student account.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-backgroundsecondary">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Reference
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {unmatchedPayments
                          .filter((p) => !p.matched)
                          .map((payment) => (
                            <tr key={payment.paymentId} className="hover:bg-backgroundsecondary">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-textDark">{payment.reference}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-textDark">
                                {payment.transactionId}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-textDark">
                                {payment.phoneNumber}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-textDark">${payment.amount}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-textDark">
                                {payment.paymentMethod}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-textDark">
                                {payment.paymentDate}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <button
                                  onClick={() => handleSelectPayment(payment)}
                                  className="text-tertiary hover:text-primary transition-colors"
                                >
                                  <Link2 size={16} className="mr-1 inline" />
                                  Select
                                </button>
                              </td>
                            </tr>
                          ))}
                        {unmatchedPayments.filter((p) => !p.matched).length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                              No unmatched payments found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Step 2: Select Student */}
              {reconciliationStep === 2 && selectedPayment && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Step 2: Select a Student</h3>

                  <div className="bg-backgroundsecondary p-4 rounded-md mb-6">
                    <h4 className="font-medium mb-2">Selected Payment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Reference</p>
                        <p className="font-medium">{selectedPayment.reference}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-medium">{selectedPayment.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">${selectedPayment.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{selectedPayment.paymentDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Method</p>
                        <p className="font-medium">{selectedPayment.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedPayment.phoneNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-textDark mb-2">Search for a Student</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, email, or registration number..."
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        className="input-field pl-10"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {searchingStudents && <div className="mt-2 text-sm text-gray-500">Searching...</div>}

                    {searchResults.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Search Results</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-backgroundsecondary">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                                  Registration
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {searchResults.map((student) => (
                                <tr key={student.studentId} className="hover:bg-backgroundsecondary">
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-textDark">
                                    {student.firstName} {student.lastName}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-textDark">
                                    {student.registrationNumber}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-textDark">{student.email}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <button
                                      onClick={() => handleSelectStudent(student)}
                                      className="text-tertiary hover:text-primary transition-colors"
                                    >
                                      <User size={16} className="mr-1 inline" />
                                      Select
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {studentSearchTerm.length > 1 && searchResults.length === 0 && !searchingStudents && (
                      <div className="mt-2 text-sm text-gray-500">No students found. Try a different search term.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Confirm and Submit */}
              {reconciliationStep === 3 && selectedPayment && selectedStudent && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Step 3: Confirm and Submit</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-backgroundsecondary p-4 rounded-md">
                      <h4 className="font-medium mb-2 flex items-center">
                        <CreditCard size={18} className="mr-2" />
                        Payment Details
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Reference</p>
                          <p className="font-medium">{selectedPayment.reference}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Transaction ID</p>
                          <p className="font-medium">{selectedPayment.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium">${selectedPayment.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">{selectedPayment.paymentDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Method</p>
                          <p className="font-medium">{selectedPayment.paymentMethod}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-backgroundsecondary p-4 rounded-md">
                      <h4 className="font-medium mb-2 flex items-center">
                        <User size={18} className="mr-2" />
                        Student Details
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">
                            {selectedStudent.firstName} {selectedStudent.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Registration Number</p>
                          <p className="font-medium">{selectedStudent.registrationNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedStudent.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-textDark mb-2">
                      Reconciliation Note (Optional)
                    </label>
                    <textarea
                      value={reconciliationNote}
                      onChange={(e) => setReconciliationNote(e.target.value)}
                      placeholder="Add any notes about this reconciliation..."
                      className="input-field min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              {reconciliationStep > 1 ? (
                <button
                  onClick={() => setReconciliationStep(reconciliationStep - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => setShowReconcileForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              )}

              {reconciliationStep < 3 ? (
                <button
                  onClick={() => {
                    if (reconciliationStep === 1 && selectedPayment) {
                      setReconciliationStep(2)
                    } else if (reconciliationStep === 2 && selectedStudent) {
                      setReconciliationStep(3)
                    }
                  }}
                  disabled={
                    (reconciliationStep === 1 && !selectedPayment) || (reconciliationStep === 2 && !selectedStudent)
                  }
                  className="px-4 py-2 bg-tertiary text-white rounded-md hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleReconcileSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-tertiary text-white rounded-md hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Reconcile Payment"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
