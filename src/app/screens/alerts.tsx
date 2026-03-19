import { motion } from "motion/react";
import {
  CloudRain,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Shield,
  Clock,
} from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "weather",
    icon: CloudRain,
    title: "Heavy rain incoming",
    message: "Expected in 45 minutes in your area",
    time: "10 mins ago",
    priority: "high",
    color: "#EF4444",
  },
  {
    id: 2,
    type: "zone",
    icon: MapPin,
    title: "Zone risk high",
    message: "Velachery showing increased delivery disruptions",
    time: "25 mins ago",
    priority: "high",
    color: "#FACC15",
  },
  {
    id: 3,
    type: "recommendation",
    icon: TrendingUp,
    title: "Move to Taramani",
    message: "52 active orders, low risk score",
    time: "1 hour ago",
    priority: "medium",
    color: "#22C55E",
  },
  {
    id: 4,
    type: "safety",
    icon: Shield,
    title: "Coverage active",
    message: "Your income protection is active for today",
    time: "3 hours ago",
    priority: "low",
    color: "#5B21B6",
  },
  {
    id: 5,
    type: "traffic",
    icon: AlertTriangle,
    title: "Traffic alert",
    message: "Heavy traffic on Mount Road affecting deliveries",
    time: "4 hours ago",
    priority: "medium",
    color: "#FACC15",
  },
  {
    id: 6,
    type: "time",
    icon: Clock,
    title: "Peak hours starting",
    message: "Lunch rush expected, high demand incoming",
    time: "5 hours ago",
    priority: "low",
    color: "#A78BFA",
  },
];

export function Alerts() {
  return (
    <div className="min-h-screen bg-[#fafafa] p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Alerts</h1>
        <p className="text-gray-500">Stay updated with real-time notifications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-3xl font-bold text-[#EF4444] mb-1">2</p>
          <p className="text-xs text-gray-500">High Priority</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-3xl font-bold text-[#FACC15] mb-1">2</p>
          <p className="text-xs text-gray-500">Medium</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-3xl font-bold text-[#22C55E] mb-1">2</p>
          <p className="text-xs text-gray-500">Low Priority</p>
        </motion.div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm border-l-4 relative overflow-hidden"
              style={{ borderLeftColor: alert.color }}
            >
              {/* Background gradient */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10"
                style={{ backgroundColor: alert.color }}
              />

              <div className="relative flex items-start gap-4">
                <div
                  className="p-3 rounded-2xl flex-shrink-0"
                  style={{ backgroundColor: `${alert.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: alert.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{alert.title}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{alert.message}</p>

                  {alert.priority === "high" && (
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 bg-[#5B21B6] text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-[#4C1D95] transition-colors">
                        Take Action
                      </button>
                      <button className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
