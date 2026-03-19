import { motion } from "motion/react";
import {
  User,
  Calendar,
  Shield,
  TrendingUp,
  Award,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import * as Progress from "@radix-ui/react-progress";

const riskInsights = [
  { label: "Weather Risk", value: 65, color: "#FACC15" },
  { label: "Traffic Risk", value: 42, color: "#22C55E" },
  { label: "Store Stability", value: 78, color: "#5B21B6" },
];

export function Profile() {
  return (
    <div className="min-h-screen bg-[#fafafa] p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-500">Manage your account and settings</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#5B21B6] to-[#A78BFA] rounded-3xl p-6 mb-6 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">Arjun</h2>
            <p className="text-white/80">Delivery Partner</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs">Days Active</span>
            </div>
            <p className="text-2xl font-bold text-white">28 ✅</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-xs">Trust Score</span>
            </div>
            <p className="text-2xl font-bold text-white">91%</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#5B21B6]" />
          Risk Insights
        </h3>

        <div className="space-y-4">
          {riskInsights.map((insight, index) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 text-sm font-medium">
                  {insight.label}
                </span>
                <span className="text-gray-900 font-bold">{insight.value}%</span>
              </div>
              <Progress.Root
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
                value={insight.value}
              >
                <Progress.Indicator
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: insight.color,
                    width: `${insight.value}%`,
                  }}
                />
              </Progress.Root>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="bg-[#5B21B6]/5 rounded-2xl p-4 border border-[#5B21B6]/10">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-[#5B21B6]" />
              <span className="text-gray-900 font-bold">Recommended Plan</span>
            </div>
            <p className="text-2xl font-bold text-[#5B21B6]">₹80/week</p>
            <p className="text-gray-600 text-sm mt-1">
              Based on your risk profile
            </p>
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6"
      >
        {[
          { icon: Settings, label: "Settings", color: "#5B21B6" },
          { icon: HelpCircle, label: "Help & Support", color: "#22C55E" },
          { icon: Shield, label: "Privacy Policy", color: "#A78BFA" },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                index !== 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <span className="text-gray-900 font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          );
        })}
      </motion.div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-white text-[#EF4444] py-4 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-sm border border-gray-100 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </motion.button>
    </div>
  );
}
