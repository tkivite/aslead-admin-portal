"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface PaymentsPieChartProps {
  receivedAmount: number;
  pendingAmount: number;
  loading?: boolean;
}

export default function PaymentsPieChart({
  receivedAmount,
  pendingAmount,
  loading = false,
}: PaymentsPieChartProps) {
  const data = [
    { name: "Received", value: receivedAmount, color: "#3DB166" },
    { name: "Pending", value: pendingAmount, color: "#FFAE42" },
  ];

  const COLORS = ["#3DB166", "#FFAE42"];

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `Ksh ${Number(value).toLocaleString()}`,
              name,
            ]}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
