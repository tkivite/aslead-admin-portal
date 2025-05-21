"use client"

import { motion } from "framer-motion"
import { Users, CheckCircle, DollarSign, Clock, BookOpen, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardStats() {
  const router = useRouter()

  const stats = [
    {
      title: "Total Students",
      value: "1,245",
      change: "+12%",
      icon: Users,
      color: "bg-primary",
      path: "/students",
    },
      {
      title: "Active Courses",
      value: "24",
      change: "+3",
      icon: BookOpen,
      color: "bg-tertiary",
      path: "/courses",
    },
    {
      title: "This Month's Payments",
      value: "Ksh. 32,150",
      change: "+8%",
      icon: DollarSign,
      color: "bg-accent",
      path: "/payments",
    },
    {
      title: "Pending Payments",
      value: "Ksh. 16,750",
      change: "-5%",
      icon: Clock,
      color: "bg-amber-500",
      path: "/payments/pending",
    },
    {
      title: "Approved Applications",
      value: "87",
      change: "+14",
      icon: CheckCircle,
      color: "bg-green-500",
      path: "/applications/approved",
    },
      {
      title: "Pending applications",
      value: "12",
      change: "total",
      icon: Calendar,
      color: "bg-secondary",
      path: "/applications",
    },
  ]

  const handleStatClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => handleStatClick(stat.path)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                 <p className="text-xs text-green-500 mt-1">{stat.change}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="text-white" size={22} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
