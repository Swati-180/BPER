import { useState } from "react";
import { Search, Bell, Settings as SettingsIcon, Plus, ChevronDown, X } from "lucide-react";

export function AdminUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen overflow-hidden relative">
      {/* Top Navbar */}
      <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="pl-10 pr-4 py-2.5 w-full bg-slate-50 border-none rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-corporateBlue/20"
          />
        </div>

        <div className="flex items-center gap-6 text-slate-500">
          <button className="hover:text-slate-800 transition-colors relative">
            <div className="w-2 h-2 rounded-full bg-corporateBlue absolute top-0 right-0 border border-white"></div>
            <Bell size={20} />
          </button>
          <button className="hover:text-slate-800 transition-colors">
            <SettingsIcon size={20} />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <button className="hover:text-slate-900 transition-colors text-sm font-bold tracking-wide">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full overflow-y-auto flex flex-col relative pb-24">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Admin Users Management</h1>
            <p className="text-sm text-slate-600">Manage platform access and user roles within the Sovereign Ledger ecosystem.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-corporateBlue hover:bg-corporateBlue-dark text-white text-sm font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={3} /> Create User
          </button>
        </div>

        {/* Action Panel & Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
          
          {/* Filters Bar */}
          <div className="bg-slate-50 p-6 border-b border-slate-100 m-6 mb-0 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-2 block">Global Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Employee ID, Name, or Email..." 
                  className="pl-9 pr-4 py-2.5 w-full bg-white border border-transparent rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-corporateBlue/20 shadow-sm"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-2 block">Role</label>
              <div className="relative relative">
                <select className="w-full bg-white border border-transparent p-2.5 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-corporateBlue/20 shadow-sm appearance-none font-medium">
                  <option>All Roles</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-2 block">Client</label>
              <div className="relative">
                <select className="w-full bg-white border border-transparent p-2.5 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-corporateBlue/20 shadow-sm appearance-none font-medium">
                  <option>All Clients</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-2 block">Status</label>
              <div className="relative">
                <select className="w-full bg-white border border-transparent p-2.5 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-corporateBlue/20 shadow-sm appearance-none font-medium">
                  <option>Any Status</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="flex-1 overflow-x-auto p-6 pt-8">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase border-b border-slate-100">
                  <th className="pb-4 px-4 w-32">Employee ID</th>
                  <th className="pb-4 px-4 w-64">Name</th>
                  <th className="pb-4 px-4">Email</th>
                  <th className="pb-4 px-4 w-40">Client</th>
                  <th className="pb-4 px-4 w-20">Band</th>
                  <th className="pb-4 px-4 w-32">Role</th>
                  <th className="pb-4 px-4 w-32">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                {/* Row 1 */}
                <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-5 px-4 font-bold text-corporateBlue">QG-88293</td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Marcus" className="w-10 h-10 rounded-full border border-slate-200 bg-slate-100" />
                      <span className="font-bold text-slate-900 leading-tight">Marcus<br/>Chen</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-slate-500 font-medium">m.chen@qgtools.com</td>
                  <td className="py-5 px-4 text-slate-700">BPER<br/>Bank</td>
                  <td className="py-5 px-4 text-slate-500">
                    <span className="bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">L4</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 tracking-wide">Admin</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-4 bg-green-100 border border-green-200 rounded-full relative mr-1 shadow-inner flex items-center">
                         <div className="w-3 h-3 bg-green-600 rounded-full absolute right-0.5 pointer-events-none"></div>
                       </div>
                       <span className="text-[10px] font-extrabold text-green-700 tracking-widest">ACTIVE</span>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="py-5 px-4 font-bold text-corporateBlue">QG-77402</td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah" className="w-10 h-10 rounded-full border border-slate-200 bg-amber-50" />
                      <span className="font-bold text-slate-900 leading-tight">Sarah<br/>Jenkins</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-slate-500 font-medium">s.jenkins@qgtools.com</td>
                  <td className="py-5 px-4 text-slate-700">QG<br/>Global</td>
                  <td className="py-5 px-4 text-slate-500">
                    <span className="bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">L5</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 tracking-wide">Employee</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-4 bg-green-100 border border-green-200 rounded-full relative mr-1 shadow-inner flex items-center">
                         <div className="w-3 h-3 bg-green-600 rounded-full absolute right-0.5 pointer-events-none"></div>
                       </div>
                       <span className="text-[10px] font-extrabold text-green-700 tracking-widest">ACTIVE</span>
                    </div>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b border-transparent hover:bg-slate-50/50">
                  <td className="py-5 px-4 font-bold text-corporateBlue">QG-11094</td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3 opacity-60">
                      <img src="https://api.dicebear.com/7.x/notionists/svg?seed=David" className="w-10 h-10 rounded-full border border-slate-200 bg-slate-200" />
                      <span className="font-bold text-slate-900 leading-tight">David<br/>Miller</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-slate-400 font-medium opacity-80">d.miller@qgtools.com</td>
                  <td className="py-5 px-4 text-slate-400 opacity-80">Internal<br/>Ops</td>
                  <td className="py-5 px-4 text-slate-400 opacity-80">
                    <span className="bg-slate-50 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-100">L3</span>
                  </td>
                  <td className="py-5 px-4 opacity-80">
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 tracking-wide">Employee</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2 opacity-60">
                       <div className="w-8 h-4 bg-slate-200 border border-slate-300 rounded-full relative mr-1 shadow-inner flex items-center">
                         <div className="w-3 h-3 bg-slate-400 rounded-full absolute left-0.5 pointer-events-none"></div>
                       </div>
                       <span className="text-[10px] font-extrabold text-slate-400 tracking-widest">INACTIVE</span>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
             <p>Showing 1 to 3 of 42 users</p>
             <div className="flex gap-2">
               <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 font-sans font-medium text-slate-400 text-lg">&lt;</button>
               <button className="w-8 h-8 flex items-center justify-center rounded bg-corporateBlue text-white shadow-sm font-sans font-medium">1</button>
               <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-900 font-sans font-medium">2</button>
               <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-900 font-sans font-medium">3</button>
               <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 font-sans font-medium text-slate-400 text-lg">&gt;</button>
             </div>
          </div>
        </div>

      </div>

      {/* Page Footer */}
      <div className="absolute bottom-6 left-8 right-8 flex justify-between text-[10px] font-extrabold text-slate-400 tracking-[0.2em] uppercase pointer-events-none">
        <p>© 2024 SOVEREIGN LEDGER PLATFORM</p>
        <div className="flex gap-8 pointer-events-auto">
          <a href="#" className="hover:text-corporateBlue transition-colors">DATA PRIVACY POLICY</a>
          <a href="#" className="hover:text-corporateBlue transition-colors">ACCESS LOGS</a>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-white px-8 py-6 flex justify-between items-start border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Create New User</h2>
                <p className="text-sm text-slate-500">Fill in the details to register a new member to the workforce ledger.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4">
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Employee ID</label>
                  <input type="text" placeholder="e.g. QG-12345" className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm" />
                </div>
                <div className="col-span-8">
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Full Name</label>
                  <input type="text" placeholder="Enter full legal name" className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Email Address</label>
                  <input type="email" placeholder="official.email@qgtools.com" className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm" />
                </div>
                <div className="col-span-4">
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Role</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm font-medium appearance-none">
                      <option>Employee</option>
                      <option>Admin</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Job Title</label>
                  <input type="text" placeholder="e.g. Senior Operations Manager" className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm" />
                </div>
                <div className="col-span-4">
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Job Band</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm font-medium appearance-none">
                      <option>L1</option>
                      <option>L2</option>
                      <option>L3</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pb-6 border-b border-slate-200/50">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Client/Business Unit</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm font-medium appearance-none">
                      <option>QG Global</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Location</label>
                  <input type="text" placeholder="e.g. Mumbai, India" className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Employee Type</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm font-medium appearance-none">
                      <option>Full-time</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Supervisor Name</label>
                  <input type="text" placeholder="Direct reporting manager" className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-2 block">Supervisor Title</label>
                  <input type="text" placeholder="e.g. VP Operations" className="w-full bg-white border border-transparent focus:border-corporateBlue outline-none p-3 rounded-lg text-sm shadow-sm" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-8 py-5 border-t border-slate-200 flex justify-end items-center gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-600 font-bold text-sm px-4 py-2 hover:bg-slate-50 rounded transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-corporateBlue hover:bg-corporateBlue-dark text-white font-bold text-sm py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
