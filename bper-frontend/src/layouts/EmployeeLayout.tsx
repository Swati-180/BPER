import { Home, FileText, ClipboardCheck, User, LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const menu = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Form", to: "/form", icon: FileText },
  { label: "Form Status", to: "/form-status", icon: ClipboardCheck },
  { label: "Profile", to: "/profile", icon: User },
];

export function EmployeeLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-64 bg-corporateBlue-dark text-slate-300 fixed left-0 top-0 h-screen z-20 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="text-white font-bold text-xl">BPER</p>
          <p className="text-[10px] tracking-widest text-slate-400 uppercase">Employee Portal</p>
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
                    isActive ? "bg-blue-600/35 text-white ring-1 ring-blue-300/40" : "hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      className={isActive ? "text-blue-100" : "text-slate-400"}
                      fill={isActive ? "currentColor" : "none"}
                      strokeWidth={isActive ? 2.2 : 1.9}
                    />
                    {item.label}
                  </>
                )}
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
