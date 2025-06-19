"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { Application } from "@/types/applications.types"
import React, { useState } from "react"
import { Calendar, ChevronDown, ChevronRight, CreditCard, MapPin } from "lucide-react"

interface RecentApplicationsTableProps {
  applications: Application[]
  loading?: boolean
}

export default function RecentApplicationsTable({ applications, loading = false }: RecentApplicationsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRow = (applicationId: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId)
    } else {
      newExpanded.add(applicationId)
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
              <th className="px-4 py-3 text-left text-sm font-medium">Applicant</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Program</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Campus</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Fee Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.slice(0, 5).map((application, index) => (
              <React.Fragment key={application.applicationId}>
                <motion.tr
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(application.applicationId)}
                >
                  <td className="px-4 py-3">
                    {expandedRows.has(application.applicationId) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-textDark">
                        {application.applicant.firstName} {application.applicant.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{application.applicant.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-textDark">{application.program.code}</div>
                      <div className="text-xs text-gray-500">{application.program.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{application.campus.name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-tertiary">
                    KES {application.feeAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        application.status === "APPROVED"
                          ? "bg-tertiary/10 text-tertiary"
                          : application.status === "PENDING"
                            ? "bg-accent/10 text-accent"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(application.submittedAt)}</td>
                </motion.tr>

                <AnimatePresence>
                  {expandedRows.has(application.applicationId) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={7} className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-textDark flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Personal Details
                            </h4>
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-medium">Mobile:</span> {application.applicant.mobile}
                              </p>
                              <p>
                                <span className="font-medium">DOB:</span> {formatDate(application.applicant.dob)}
                              </p>
                              <p>
                                <span className="font-medium">Education:</span>{" "}
                                {application.applicant.currentEducationLevel}
                              </p>
                              <p>
                                <span className="font-medium">Citizenship:</span> {application.applicant.citizenship}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-textDark flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Program Details
                            </h4>
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-medium">Duration:</span> {application.program.durationMonths}{" "}
                                months
                              </p>
                              <p>
                                <span className="font-medium">Tuition:</span> KES{" "}
                                {application.program.tuitionFee.toLocaleString()}
                              </p>
                              <p>
                                <span className="font-medium">Campus:</span> {application.campus.location}
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
                                    application.feePaymentStatus === "PAID"
                                      ? "bg-tertiary/10 text-tertiary"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {application.feePaymentStatus.replace("_", " ")}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium">Reference:</span> {application.paymentReference || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Applied:</span> {formatDate(application.createdAt)}
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
