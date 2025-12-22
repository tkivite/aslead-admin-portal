"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, ChevronLeft, ChevronFirst, ChevronLast, Download, Search } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  pagination?: {
    currentPage: number
    totalPages: number
    totalElements: number
    onPageChange: (page: number) => void
  }
  expandableRow?: (item: T) => React.ReactNode
  onExport?: () => void
  searchable?: boolean
  onSearch?: (query: string) => void
  title?: string
  onRowClick?: (item: T) => void
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  loading = false,
  pagination,
  expandableRow,
  onExport,
  searchable = false,
  onSearch,
  title,
  onRowClick,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const getRowId = (item: T) => {
    return item.id || item.applicationId || item.studentId || item.TransID || Math.random().toString() || item.examId
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && <h2 className="text-xl font-semibold text-textDark">{title}</h2>}
        <div className="flex flex-col sm:flex-row gap-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
              />
            </div>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-tertiary text-white">
                {expandableRow && <th className="px-4 py-3 text-left text-sm font-medium w-8"></th>}
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 text-left text-sm font-medium">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.map((item, index) => {
                const rowId = getRowId(item)
                return (
                  <React.Fragment key={rowId}>
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`${expandableRow ? "cursor-pointer" : ""} ${onRowClick ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50"}`}
                      onClick={() => {
                        if (onRowClick) {
                          onRowClick(item)
                        } else if (expandableRow) {
                          toggleRow(rowId)
                        }
                      }}
                    >
                      {expandableRow && (
                        <td className="px-4 py-3">
                          {expandedRows.has(rowId) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3">
                          {column.render ? column.render(item) : item[column.key]}
                        </td>
                      ))}
                    </motion.tr>

                    {expandableRow && (
                      <AnimatePresence>
                        {expandedRows.has(rowId) && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td colSpan={columns.length + 1} className="px-4 py-4 bg-gray-50">
                              {expandableRow(item)}
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.currentPage + 1} of {pagination.totalPages} ({pagination.totalElements} total
              items)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => pagination.onPageChange(0)}
                disabled={pagination.currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronFirst className="h-4 w-4" />
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium">
                {pagination.currentPage + 1} / {pagination.totalPages}
              </span>
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.totalPages - 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLast className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
