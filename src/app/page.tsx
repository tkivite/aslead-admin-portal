"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  GraduationCap,
  UsersRound,
  Calendar,
  CalendarDays,
  CalendarRange,
  DollarSign,
} from "lucide-react";

import StatCard from "./components/dashboard/StatCard";
import ApplicationsPieChart from "./components/dashboard/ApplicationsPieChart";
import PaymentsPieChart from "./components/dashboard/PaymentsPieChart";
import RecentApplicationsTable from "./components/dashboard/RecentApplicationsTable";
import RecentPaymentsTable from "./components/dashboard/RecentPaymentsTable";

import type { Application } from "@/types/applications.types";
import type { Student } from "@/types/students.types";
import type { Payment, Invoice } from "@/types/payments.types";
import { applicationsService } from "@/services/applications.api";
import { studentsService } from "@/services/students.api";
import { paymentsService } from "@/services/payments.api";



export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [pendingApplications, setPendingApplications] = useState<Application[]>(
    []
  );
  const [approvedApplications, setApprovedApplications] = useState<
    Application[]
  >([]);
  const [activeStudents, setActiveStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        pendingRes,
        approvedRes,
        activeStudentsRes,
        allStudentsRes,
        paymentsRes,
        invoicesRes,
        recentAppsRes,
      ] = await Promise.all([
        applicationsService.getPendingApplications(),
        applicationsService.getApprovedApplications(),
        studentsService.getActiveStudents(),
        studentsService.getPaginatedStudents(),
        paymentsService.getPaginatedPayments(),
        paymentsService.getInvoices(),
        applicationsService.getRecentApplications(),
      ]);

      setPendingApplications(pendingRes.content);
      setApprovedApplications(approvedRes.content);
      setActiveStudents(activeStudentsRes.content);
      setAllStudents(allStudentsRes.content);
      setPayments(paymentsRes.content);
      setInvoices(invoicesRes.content);
      setRecentApplications(recentAppsRes.content);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate payment metrics
  const calculatePaymentMetrics = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const paymentsToday = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= today;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    const paymentsThisWeek = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= thisWeekStart;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    const paymentsThisMonth = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate >= thisMonthStart;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    const totalReceivable = invoices
      .filter((invoice) => invoice.invoiceType === "RECEIVABLE")
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

    const totalReceived = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
 
    const pendingPayments = totalReceivable - totalReceived;
  
    return {
      paymentsToday,
      paymentsThisWeek,
      paymentsThisMonth,
      totalReceivable,
      totalReceived,
      pendingPayments,
    };
  };

  const paymentMetrics = calculatePaymentMetrics();


  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-textDark mb-8">Dashboard</h1>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Applications"
            value={pendingApplications.length}
            icon={Users}
            loading={loading}
          />
          <StatCard
            title="Approved Applications"
            value={approvedApplications.length}
            icon={UserCheck}
            loading={loading}
          />
          <StatCard
            title="Active Students"
            value={activeStudents.length}
            icon={GraduationCap}
            loading={loading}
          />
          <StatCard
            title="All Students"
            value={allStudents.length}
            icon={UsersRound}
            loading={loading}
          />
        </div>

        {/* Payment Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Payments Today"
            value={`Ksh. ${paymentMetrics.paymentsToday.toLocaleString()}`}
            icon={Calendar}
            loading={loading}
          />
          <StatCard
            title="Payments This Week"
            value={`Ksh. ${paymentMetrics.paymentsThisWeek.toLocaleString()}`}
            icon={CalendarDays}
            loading={loading}
          />
          <StatCard
            title="Payments This Month"
            value={`Ksh. ${paymentMetrics.paymentsThisMonth.toLocaleString()}`}
            icon={CalendarRange}
            loading={loading}
          />
          <StatCard
            title="Total Receivable"
            value={`Ksh. ${paymentMetrics.totalReceivable.toLocaleString()}`}
            icon={DollarSign}
            loading={loading}
          />
        </div>
      </motion.div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-textDark mb-4">
            Recent Applications
          </h2>
          <RecentApplicationsTable
            applications={recentApplications}
            loading={loading}
          />
        </motion.div>

        {/* Applications Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-textDark mb-4">
            Pending / Approved
          </h2>
          <ApplicationsPieChart
            pendingCount={pendingApplications.length}
            approvedCount={approvedApplications.length}
            loading={loading}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payments Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-textDark mb-4">
            Payments Pending / Received
          </h2>
          <PaymentsPieChart
            receivedAmount={paymentMetrics.totalReceived}
            pendingAmount={paymentMetrics.pendingPayments}
            loading={loading}
          />
        </motion.div>

        {/* Recent Payments Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-textDark mb-4">
            Recent Payments
          </h2>
          <RecentPaymentsTable payments={payments} loading={loading} />
        </motion.div>
      </div>
    </div>
  );
}
