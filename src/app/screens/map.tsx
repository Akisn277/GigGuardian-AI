import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation, TrendingUp, AlertCircle, X } from "lucide-react";

interface Zone {
  id: number;
  name: string;
  demand: "high" | "medium" | "low";
  risk: "low" | "medium" | "high";
  orders: number;
  avgEarnings: number;
  x: number;
  y: number;
}

const zones: Zone[] = [
  {
    id: 1,
    name: "Velachery",
    demand: "high",
    risk: "medium",
    orders: 45,
    avgEarnings: 350,
    x: 30,
    y: 40,
  },
  {
    id: 2,
    name: "Taramani",
    demand: "high",
    risk: "low",
    orders: 52,
    avgEarnings: 420,
    x: 60,
    y: 30,
  },
  {
    id: 3,
    name: "Adyar",
    demand: "medium",
    risk: "medium",
    orders: 32,
    avgEarnings: 280,
    x: 45,
    y: 65,
  },
  {
    id: 4,
    name: "Guindy",
    demand: "low",
    risk: "high",
    orders: 18,
    avgEarnings: 150,
    x: 20,
    y: 20,
  },
];

export function Map() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const getZoneColor = (zone: Zone) => {
    if (zone.demand === "high" && zone.risk === "low") return "#22C55E";
    if (zone.demand === "high") return "#FACC15";
    if (zone.risk === "high") return "#EF4444";
    return "#A78BFA";
  };

  return (
    <div className="h-screen bg-[#fafafa] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Zone Map</h1>
        <p className="text-gray-500 text-sm">Tap zones for details</p>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, #ccc 1px, transparent 1px),
              linear-gradient(to bottom, #ccc 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Zones */}
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: zone.id * 0.1 }}
            className="absolute"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => setSelectedZone(zone)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-50"
                style={{
                  backgroundColor: getZoneColor(zone),
                  width: "80px",
                  height: "80px",
                  transform: "translate(-25%, -25%)",
                }}
              />
              {/* Zone Circle */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                style={{ backgroundColor: getZoneColor(zone) }}
              >
                <span className="text-white font-bold text-xs">
                  {zone.name.slice(0, 3)}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {selectedZone && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedZone(null)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl z-50 p-6 pb-24"
            >
              <button
                onClick={() => setSelectedZone(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedZone.name}
                </h2>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedZone.demand === "high"
                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                        : selectedZone.demand === "medium"
                        ? "bg-[#FACC15]/10 text-[#FACC15]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selectedZone.demand.toUpperCase()} DEMAND
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedZone.risk === "low"
                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                        : selectedZone.risk === "medium"
                        ? "bg-[#FACC15]/10 text-[#FACC15]"
                        : "bg-[#EF4444]/10 text-[#EF4444]"
                    }`}
                  >
                    {selectedZone.risk.toUpperCase()} RISK
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#fafafa] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#5B21B6]" />
                    <span className="text-gray-500 text-sm">Orders/day</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedZone.orders}
                  </p>
                </div>
                <div className="bg-[#fafafa] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-gray-500 text-sm">Avg Earnings</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{selectedZone.avgEarnings}
                  </p>
                </div>
              </div>

              <button className="w-full bg-[#5B21B6] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-[#4C1D95] transition-colors">
                <Navigation className="w-5 h-5" />
                Move Here
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
