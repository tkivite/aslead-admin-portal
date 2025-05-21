"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const yearlyData = [
  { month: "Jan", students: 65 },
  { month: "Feb", students: 78 },
  { month: "Mar", students: 90 },
  { month: "Apr", students: 81 },
  { month: "May", students: 95 },
  { month: "Jun", students: 110 },
  { month: "Jul", students: 129 },
  { month: "Aug", students: 145 },
  { month: "Sep", students: 160 },
  { month: "Oct", students: 175 },
  { month: "Nov", students: 190 },
  { month: "Dec", students: 205 },
]

const quarterlyData = yearlyData.slice(-3)
const monthlyData = yearlyData.slice(-1)

export default function EnrollmentChart() {
  const [timeframe, setTimeframe] = useState("yearly")
  const [chartData, setChartData] = useState(yearlyData)

  // Update chart data when timeframe changes
  useEffect(() => {
    switch (timeframe) {
      case "monthly":
        setChartData(monthlyData)
        break
      case "quarterly":
        setChartData(quarterlyData)
        break
      case "yearly":
      default:
        setChartData(yearlyData)
        break
    }
  }, [timeframe])

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1 text-xs rounded-md ${
              timeframe === "monthly" ? "bg-tertiary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe("quarterly")}
            className={`px-3 py-1 text-xs rounded-md ${
              timeframe === "quarterly" ? "bg-tertiary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setTimeframe("yearly")}
            className={`px-3 py-1 text-xs rounded-md ${
              timeframe === "yearly" ? "bg-tertiary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#3DB166"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: "#3DB166", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
