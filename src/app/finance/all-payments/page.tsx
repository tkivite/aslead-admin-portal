"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Receipt, Smartphone } from "lucide-react"
import DataTable from "@/app/components/common/DataTable"

import type { Payment } from "@/types/payments.types"
import { exportPaymentsToCSV } from "@/utils/csvExport"
import { paymentsService } from "@/services/payments.api"
export default function AllPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const fetchPayments = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await paymentsService.getPaginatedPayments(currentPage, 10)
      setPayments(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchPayments()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTransactionTime = (transactionTime: string) => {
    if (transactionTime.length === 14) {
      const year = transactionTime.substring(0, 4)
      const month = transactionTime.substring(4, 6)
      const day = transactionTime.substring(6, 8)
      const hour = transactionTime.substring(8, 10)
      const minute = transactionTime.substring(10, 12)
      const second = transactionTime.substring(12, 14)

      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return transactionTime
  }

  const columns = [
    {
      key: "receivedFrom",
      label: "From",
      render: (payment: Payment) => (
        <div>
          <div className="text-sm font-medium text-textDark">{payment.receivedFrom}</div>
          <div className="text-xs text-gray-500">{payment.mobileNumber}</div>
        </div>
      ),
    },
    {
      key: "reference",
      label: "Reference",
      render: (payment: Payment) => (
        <div>
          <div className="text-sm font-medium text-textDark">{payment.reference}</div>
          <div className="text-xs text-gray-500">{payment.description}</div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (payment: Payment) => (
        <span className="text-sm font-bold text-tertiary">KES {payment.amount.toLocaleString()}</span>
      ),
    },
    {
      key: "paymentMode",
      label: "Method",
      render: (payment: Payment) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
          {payment.paymentMode}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (payment: Payment) => (
        <div>
          <div className="text-sm text-gray-600">{formatDate(payment.createdAt)}</div>
          <div className="text-xs text-gray-500">{formatTime(payment.createdAt)}</div>
        </div>
      ),
    },
  ]

  const expandableRow = (payment: Payment) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Payment Details
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Channel:</span> {payment.channel}
          </p>
          <p>
            <span className="font-medium">Payment For:</span> {payment.paymentFor.replace("_", " ")}
          </p>
          <p>
            <span className="font-medium">Received By:</span> {payment.receivedBy}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Transaction Info
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Invoice ID:</span>
            <span className="font-mono text-xs ml-1">{payment.invoiceId}</span>
          </p>
          <p>
            <span className="font-medium">Payment ID:</span>
            <span className="font-mono text-xs ml-1">{payment.id.substring(0, 8)}...</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Timestamps
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Transaction Time:</span> {formatTransactionTime(payment.transactionTime)}
          </p>
          <p>
            <span className="font-medium">Recorded:</span> {formatDate(payment.createdAt)} at{" "}
            {formatTime(payment.createdAt)}
          </p>
          <p>
            <span className="font-medium">Updated:</span> {formatDate(payment.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  )

  const handleExport = () => {
    exportPaymentsToCSV(payments)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-textDark mb-2">All Payments</h1>
        <p className="text-gray-600">View and manage all payment transactions</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <DataTable
          data={payments}
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
          title={`All Payments (${totalElements})`}
        />
      </motion.div>
    </div>
  )
}
