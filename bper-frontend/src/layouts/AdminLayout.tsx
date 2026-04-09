import { LayoutDashboard, Users, ClipboardList, BarChart2, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const menu = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Pending Users", to: "/admin/pending-users", icon: Users },
  { label: "Forms", to: "/admin/forms", icon: ClipboardList },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart2 },
];

export function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-64 bg-corporateBlue-dark text-slate-300 fixed left-0 top-0 h-screen z-20 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="text-white font-bold text-xl">BPER</p>
          <p className="text-[10px] tracking-widest text-slate-400 uppercase">Admin Console</p>
        </div>

        <nav className="p-3 flex-1 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-blue-600/30 text-white" : "hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 min-h-screen min-w-0 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
