"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, Smartphone, Receipt, Clock } from "lucide-react"
import type { Payment } from "@/types/payments.types"
interface RecentPaymentsTableProps {
  payments: Payment[]
  loading?: boolean
}

export default function RecentPaymentsTable({ payments, loading = false }: RecentPaymentsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (paymentId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId)
    } else {
      newExpanded.add(paymentId)
    }
    setExpandedRows(newExpanded)
  }

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
    // Format: "20250614153549" to readable format
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

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-tertiary text-white">
              <th className="px-4 py-3 text-left text-sm font-medium w-8"></th>
              <th className="px-4 py-3 text-left text-sm font-medium">From</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Reference</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Method</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.slice(0, 5).map((payment, index) => (
              <React.Fragment key={payment.id}>
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(payment.id)}
                >
                  <td className="px-4 py-3">
                    {expandedRows.has(payment.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-textDark">{payment.receivedFrom}</div>
                      <div className="text-xs text-gray-500">{payment.mobileNumber}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-textDark">{payment.reference}</div>
                      <div className="text-xs text-gray-500">{payment.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-tertiary">KES {payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                      {payment.paymentMode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm text-gray-600">{formatDate(payment.createdAt)}</div>
                      <div className="text-xs text-gray-500">{formatTime(payment.createdAt)}</div>
                    </div>
                  </td>
                </motion.tr>

                <AnimatePresence>
                  {expandedRows.has(payment.id) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={6} className="px-4 py-4 bg-gray-50">
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
                                <span className="font-medium">Transaction Time:</span>{" "}
                                {formatTransactionTime(payment.transactionTime)}
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
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
