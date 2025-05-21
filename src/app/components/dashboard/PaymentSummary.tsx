"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { month: "Jan", fullPayment: 12000, partialPayment: 8000, pendingPayment: 4000 },
  { month: "Feb", fullPayment: 15000, partialPayment: 10000, pendingPayment: 5000 },
  { month: "Mar", fullPayment: 18000, partialPayment: 12000, pendingPayment: 6000 },
  { month: "Apr", fullPayment: 16000, partialPayment: 9000, pendingPayment: 7000 },
  { month: "May", fullPayment: 20000, partialPayment: 15000, pendingPayment: 5000 },
  { month: "Jun", fullPayment: 22000, partialPayment: 16000, pendingPayment: 6000 },
]

export default function PaymentSummary() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `Ksh.${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`Ksh. ${value}`, ""]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Legend />
          <Bar dataKey="fullPayment" name="Full Payment" fill="#3DB166" radius={[4, 4, 0, 0]} />
          <Bar dataKey="partialPayment" name="Partial Payment" fill="#51BE78" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pendingPayment" name="Pending Payment" fill="#FFAE42" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
