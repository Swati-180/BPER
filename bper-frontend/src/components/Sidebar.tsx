import {
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  HelpCircle,
  LogOut,
  Users,
  LineChart,
  Target
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <div className="w-64 bg-corporateBlue-dark min-h-screen flex flex-col fixed left-0 top-0 text-slate-300 z-50">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-blue-500 p-2 rounded text-white shrink-0 font-bold text-lg w-10 h-10 flex items-center justify-center shadow">
            B
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
              Admin Console
            </h1>
            <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5">
              Institutional Ledger
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActivePage("dashboard")}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm ${
                activePage === "dashboard"
                  ? "bg-corporateBlue text-white border-l-4 border-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
          </li>
          <li>
            <button
              className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
            >
              <ClipboardList size={18} />
              All Records
            </button>
          </li>
          <li>
             <button
              onClick={() => setActivePage("users")}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm ${
                activePage === "users"
                  ? "bg-corporateBlue text-white border-l-0 rounded-r-full font-bold ml-0 mr-4"
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <Users size={18} />
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage("fitment")}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm ${
                activePage === "fitment"
                  ? "bg-corporateBlue text-white border-l-0 rounded-r-full font-bold ml-0 mr-4"
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <LineChart size={18} />
              Fitment Scorer
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage("analytics")}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm ${
                activePage === "analytics"
                  ? "bg-corporateBlue text-white border-l-0 rounded-r-full font-bold ml-0 mr-4"
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <BarChart2 size={18} />
              Process Analytics
            </button>
          </li>
          <li>
             <button
              onClick={() => setActivePage("employee360")}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm ${
                activePage === "employee360"
                  ? "bg-corporateBlue text-white border-l-4 border-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <Target size={18} />
              Employee 360
            </button>
          </li>
          <li>
            <button
              onClick={() => setActivePage("wizard")}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors text-sm ${
                activePage === "wizard"
                  ? "bg-corporateBlue text-white border-l-4 border-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              }`}
            >
              <ClipboardList size={18} />
              Form Wizard
            </button>
          </li>
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 space-y-1 mb-2">
        <button className="w-full flex items-center gap-3 py-2 px-1 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <HelpCircle size={18} />
          Help Center
        </button>
        <button className="w-full flex items-center gap-3 py-2 px-1 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
