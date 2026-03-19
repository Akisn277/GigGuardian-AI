import { Outlet, useLocation, Link } from "react-router";
import { Home, MapPin, Wallet, Bell, User } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/map", label: "Map", icon: MapPin },
    { path: "/earnings", label: "Earnings", icon: Wallet },
    { path: "/alerts", label: "Alerts", icon: Bell },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors"
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[#5B21B6]" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? "text-[#5B21B6] font-medium" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
