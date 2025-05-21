"use client"

import { motion } from "framer-motion"

const students = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    course: "Leadership Development",
    date: "2023-05-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    course: "Ethical Leadership",
    date: "2023-05-14",
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    course: "Management Skills",
    date: "2023-05-12",
    status: "Pending",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    course: "Communication Skills",
    date: "2023-05-10",
    status: "Active",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert.b@example.com",
    course: "Leadership Development",
    date: "2023-05-08",
    status: "Inactive",
  },
]

export default function RecentStudents() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-backgroundsecondary">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student, index) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-backgroundsecondary"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textDark">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{student.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{student.course}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{student.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : student.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.status}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
