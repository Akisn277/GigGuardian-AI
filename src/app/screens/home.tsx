import { motion } from "motion/react";
import { IndianRupee, MapPin, Clock, AlertTriangle } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] p-4 pb-8">
      {/* Top Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Hi Arjun 👋</h1>
          <div className="bg-[#FACC15] text-gray-900 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Medium Risk</span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#5B21B6] to-[#A78BFA] rounded-2xl p-4 mb-6 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-white" />
          <p className="text-white font-medium">
            ⚠️ Heavy rain expected in 45 mins
          </p>
        </div>
      </motion.div>

      {/* Main Cards */}
      <div className="space-y-4">
        {/* Earnings Protected Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#22C55E]/10 p-3 rounded-2xl">
              <IndianRupee className="w-6 h-6 text-[#22C55E]" />
            </div>
            <h3 className="text-gray-600 font-medium">Earnings Protected</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">₹450</span>
            <span className="text-gray-500">covered today</span>
          </div>
        </motion.div>

        {/* Current Zone Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#5B21B6]/10 p-3 rounded-2xl">
              <MapPin className="w-6 h-6 text-[#5B21B6]" />
            </div>
            <h3 className="text-gray-600 font-medium">Current Zone</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">Velachery</p>
              <p className="text-gray-500">Risk Score: 0.62</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FACC15] to-[#EF4444] flex items-center justify-center">
              <span className="text-white font-bold">0.62</span>
            </div>
          </div>
        </motion.div>

        {/* Active Hours Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#A78BFA]/10 p-3 rounded-2xl">
              <Clock className="w-6 h-6 text-[#A78BFA]" />
            </div>
            <h3 className="text-gray-600 font-medium">Active Hours</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">3.5</span>
            <span className="text-gray-500">hours today</span>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#5B21B6] to-[#A78BFA] rounded-3xl p-5 shadow-md"
          >
            <p className="text-white/80 mb-1">Orders</p>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="text-white/60 text-sm mt-1">+3 from yesterday</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#22C55E] to-[#16a34a] rounded-3xl p-5 shadow-md"
          >
            <p className="text-white/80 mb-1">Today's Earnings</p>
            <p className="text-3xl font-bold text-white">₹350</p>
            <p className="text-white/60 text-sm mt-1">Active since 9 AM</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
