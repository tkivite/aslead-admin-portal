"use client"

import { motion } from "framer-motion"

const payments = [
  {
    id: 1,
    student: "John Doe",
    course: "Leadership Development",
    amount: 1200,
    dueDate: "2023-06-01",
    status: "Upcoming",
  },
  {
    id: 2,
    student: "Jane Smith",
    course: "Ethical Leadership",
    amount: 950,
    dueDate: "2023-06-05",
    status: "Upcoming",
  },
  {
    id: 3,
    student: "Michael Johnson",
    course: "Management Skills",
    amount: 1100,
    dueDate: "2023-06-10",
    status: "Upcoming",
  },
  {
    id: 4,
    student: "Sarah Williams",
    course: "Communication Skills",
    amount: 850,
    dueDate: "2023-05-25",
    status: "Overdue",
  },
  {
    id: 5,
    student: "Robert Brown",
    course: "Leadership Development",
    amount: 1200,
    dueDate: "2023-05-20",
    status: "Overdue",
  },
]

export default function UpcomingPayments() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-backgroundsecondary">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Status</th>
         
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment, index) => (
            <motion.tr
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-backgroundsecondary"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textDark">{payment.student}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{payment.course}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">Ksh. {payment.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{payment.dueDate}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === "Upcoming" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status}
                </span>
              </td>
             
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
