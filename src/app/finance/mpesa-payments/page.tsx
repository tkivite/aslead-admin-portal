"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Receipt, Smartphone } from "lucide-react"
import DataTable from "@/app/components/common/DataTable"
import type { MpesaPayment } from "@/types/payments.types"
import { exportMpesaPaymentsToCSV } from "@/utils/csvExport"
import { paymentsService } from "@/services/payments.api"
export default function MpesaPaymentsPage() {
  const [payments, setPayments] = useState<MpesaPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    fetchPayments()
  }, [currentPage])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await paymentsService.getMpesaPayments(currentPage, 10)
      setPayments(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Error fetching MPESA payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
      key: "FirstName",
      label: "From",
      render: (payment: MpesaPayment) => (
        <div>
          <div className="text-sm font-medium text-textDark">{payment.FirstName}</div>
          <div className="text-xs text-gray-500 font-mono">
            {payment.MSISDN.length > 20 ? `${payment.MSISDN.substring(0, 20)}...` : payment.MSISDN}
          </div>
        </div>
      ),
    },
    {
      key: "TransID",
      label: "Transaction ID",
      render: (payment: MpesaPayment) => (
        <div>
          <div className="text-sm font-medium text-textDark font-mono">{payment.TransID}</div>
          <div className="text-xs text-gray-500">{payment.BillRefNumber}</div>
        </div>
      ),
    },
    {
      key: "TransAmount",
      label: "Amount",
      render: (payment: MpesaPayment) => (
        <span className="text-sm font-bold text-tertiary">KES {payment.TransAmount.toLocaleString()}</span>
      ),
    },
    {
      key: "TransactionType",
      label: "Type",
      render: (payment: MpesaPayment) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
          {payment.TransactionType}
        </span>
      ),
    },
    {
      key: "TransTime",
      label: "Transaction Time",
      render: (payment: MpesaPayment) => (
        <div>
          <div className="text-sm text-gray-600">{formatTransactionTime(payment.TransTime)}</div>
          <div className="text-xs text-gray-500">{formatDate(payment.createdAt)}</div>
        </div>
      ),
    },
  ]

  const expandableRow = (payment: MpesaPayment) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Transaction Details
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Transaction ID:</span> {payment.TransID}
          </p>
          <p>
            <span className="font-medium">Business Code:</span> {payment.BusinessShortCode}
          </p>
          <p>
            <span className="font-medium">Bill Reference:</span> {payment.BillRefNumber}
          </p>
          <p>
            <span className="font-medium">Third Party ID:</span> {payment.ThirdPartyTransID || "N/A"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Payment Info
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Amount:</span> KES {payment.TransAmount.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Account Balance:</span> KES {payment.OrgAccountBalance.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Invoice Number:</span> {payment.InvoiceNumber || "N/A"}
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
            <span className="font-medium">Transaction Time:</span> {formatTransactionTime(payment.TransTime)}
          </p>
          <p>
            <span className="font-medium">Recorded:</span> {formatDate(payment.createdAt)}
          </p>
          <p>
            <span className="font-medium">MSISDN:</span>
            <span className="font-mono text-xs ml-1 break-all">{payment.MSISDN}</span>
          </p>
        </div>
      </div>
    </div>
  )

  const handleExport = () => {
    exportMpesaPaymentsToCSV(payments)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-textDark mb-2">MPESA Payments</h1>
        <p className="text-gray-600">View and manage MPESA payment transactions</p>
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
          title={`MPESA Payments (${totalElements})`}
        />
      </motion.div>
    </div>
  )
}
