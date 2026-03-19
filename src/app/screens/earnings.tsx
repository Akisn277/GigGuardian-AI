import { motion } from "motion/react";
import { TrendingDown, TrendingUp, IndianRupee } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { day: "Mon", amount: 420 },
  { day: "Tue", amount: 380 },
  { day: "Wed", amount: 450 },
  { day: "Thu", amount: 320 },
  { day: "Fri", amount: 350 },
  { day: "Sat", amount: 480 },
  { day: "Sun", amount: 410 },
];

const claims = [
  {
    id: 1,
    reason: "Weather disruption - Rain",
    status: "approved",
    amount: 300,
    date: "Mar 18",
  },
  {
    id: 2,
    reason: "Store closure - Blinkit",
    status: "pending",
    amount: 150,
    date: "Mar 17",
  },
  {
    id: 3,
    reason: "Low demand period",
    status: "approved",
    amount: 200,
    date: "Mar 15",
  },
];

export function Earnings() {
  return (
    <div className="min-h-screen bg-[#fafafa] p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Earnings & Claims
        </h1>
        <p className="text-gray-500">Track your income protection</p>
      </div>

      {/* Compensation Eligible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#5B21B6] to-[#A78BFA] rounded-3xl p-6 mb-6 shadow-lg"
      >
        <p className="text-white/80 mb-2">Compensation Eligible</p>
        <div className="flex items-baseline gap-2 mb-1">
          <IndianRupee className="w-8 h-8 text-white" />
          <span className="text-5xl font-bold text-white">320</span>
        </div>
        <p className="text-white/60">Based on this week's data</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            <span className="text-xs text-gray-500">Expected</span>
          </div>
          <p className="text-xl font-bold text-gray-900">₹800</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-1 mb-1">
            <IndianRupee className="w-4 h-4 text-[#5B21B6]" />
            <span className="text-xs text-gray-500">Actual</span>
          </div>
          <p className="text-xl font-bold text-gray-900">₹350</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown className="w-4 h-4 text-[#EF4444]" />
            <span className="text-xs text-gray-500">Loss</span>
          </div>
          <p className="text-xl font-bold text-[#EF4444]">₹450</p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-gray-900 font-bold mb-4">Weekly Earnings</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B21B6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5B21B6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#5B21B6"
              strokeWidth={3}
              dot={{ fill: "#5B21B6", r: 4 }}
              activeDot={{ r: 6 }}
              fill="url(#colorAmount)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Claims List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h2>
        <div className="space-y-3">
          {claims.map((claim, index) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">
                    {claim.reason}
                  </p>
                  <p className="text-gray-500 text-sm">{claim.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    ₹{claim.amount}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      claim.status === "approved"
                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                        : "bg-[#FACC15]/10 text-[#FACC15]"
                    }`}
                  >
                    {claim.status === "approved" ? "✓ Approved" : "⏳ Pending"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
