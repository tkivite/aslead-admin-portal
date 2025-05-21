"use client"

import { motion } from "framer-motion"
import DashboardStats from "./components/dashboard/DashboardStats"
import EnrollmentChart from "./components/dashboard/EnrollmentChart"
import PaymentSummary from "./components/dashboard/PaymentSummary"
import CourseDistribution from "./components/dashboard/CourseDistribution"
import RecentStudents from "./components/dashboard/RecentStudents"
import UpcomingPayments from "./components/dashboard/UpcomingPayments"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-textDark mb-6">Dashboard</h1>

        <DashboardStats />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Enrollment Trends</h2>
          <EnrollmentChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
          <PaymentSummary />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card lg:col-span-1"
        >
          <h2 className="text-xl font-semibold mb-4">Course Distribution</h2>
          <CourseDistribution />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card lg:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Students</h2>
          <RecentStudents />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-4">Upcoming Payments</h2>
        <UpcomingPayments />
      </motion.div>
    </div>
  )
}
