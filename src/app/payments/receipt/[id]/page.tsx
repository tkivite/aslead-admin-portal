"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Image from "next/image"

interface Payment {
  id: string
  student: string
  studentId: string
  course: string
  amount: number
  date: string
  method: string
  reference: string
  status: string
  description: string
  issuedBy: string
}
// This is a mock data array. In a real application, this would be fetched from an API.

// Mock payment data
const paymentsData = [
  {
    id: "PAY-001245",
    student: "John Doe",
    studentId: "STD-001",
    course: "Leadership Development",
    amount: 1200,
    date: "2023-05-15",
    method: "M-Pesa",
    reference: "MPESA7845123",
    status: "Confirmed",
    description: "Full payment for Leadership Development course",
    issuedBy: "Admin User",
  },
  {
    id: "PAY-001246",
    student: "Jane Smith",
    studentId: "STD-002",
    course: "Ethical Leadership",
    amount: 950,
    date: "2023-05-14",
    method: "Bank Transfer",
    reference: "BT98765432",
    status: "Pending",
    description: "Partial payment for Ethical Leadership course",
    issuedBy: "Admin User",
  },
  // Add more payment data as needed
]

export default function PaymentReceiptPage() {
  const router = useRouter()
  const params = useParams()
  const paymentId = params.id as string

  const [payment, setPayment] = useState<Payment|null|undefined>(null)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundPayment = paymentsData.find((p) => p.id === paymentId)
    setPayment(foundPayment)
  }, [paymentId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    alert("Downloading receipt as PDF...")
    // In a real application, this would generate a PDF and trigger a download
  }

  if (!payment) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading payment information...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden"
      >
        <div className="flex items-center">
          <button
            onClick={() => router.push("/payments")}
            className="mr-4 p-2 rounded-full hover:bg-backgroundsecondary"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-textDark">Payment Receipt</h1>
        </div>
        <div className="flex space-x-3">
          <button onClick={handlePrint} className="btn-secondary flex items-center">
            <Printer size={18} className="mr-2" />
            Print Receipt
          </button>
          <button onClick={handleDownloadPDF} className="btn-tertiary flex items-center">
            <Download size={18} className="mr-2" />
            Download PDF
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto"
      >
        <div className="receipt-container">
          {/* Receipt Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                        <Image src="/favicon.png" alt="ASLEAD Logo" width={24} height={24} className="object-contain" />
                      </div>
              <div>
                <h2 className="text-xl font-bold">Africa Servant Leadership Development Institute</h2>
                <p className="text-sm text-gray-500">123 Leadership Avenue, Nairobi, Kenya</p>
                <p className="text-sm text-gray-500">info@aslead.org | +254 712 345 678</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold">Receipt</h3>
              <p className="text-sm text-gray-500">#{payment.id}</p>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Issued To:</h4>
              <p className="font-medium">{payment.student}</p>
              <p className="text-sm">Student ID: {payment.studentId}</p>
              <p className="text-sm">Course: {payment.course}</p>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Payment Details:</h4>
              <p className="text-sm">Date: {payment.date}</p>
              <p className="text-sm">Method: {payment.method}</p>
              <p className="text-sm">Reference: {payment.reference}</p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={
                    payment.status === "Confirmed" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"
                  }
                >
                  {payment.status}
                </span>
              </p>
            </div>
          </div>

          {/* Payment Description */}
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Description:</h4>
            <p>{payment.description}</p>
          </div>

          {/* Payment Amount */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-500">Amount Paid:</h4>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">Ksh. {payment.amount.toFixed(2)}</p>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
            <p>This is an official receipt from Africa Servant Leadership Development Institute.</p>
            <p>
              Issued by: {payment.issuedBy} on {payment.date}
            </p>
            <p className="mt-2">Thank you for your payment!</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
