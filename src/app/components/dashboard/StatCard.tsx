"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon

  loading?: boolean
}

export default function StatCard({ title, value, icon: Icon, loading = false }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg shadow-sm border 
         bg-white border-gray-200
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium text-gray-600`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 text-textDark`}>
            {loading ? "..." : value}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-tertiary/10`}>
          <Icon className={`h-6 w-6 text-tertiary`} />
        </div>
      </div>
    </motion.div>
  )
}
