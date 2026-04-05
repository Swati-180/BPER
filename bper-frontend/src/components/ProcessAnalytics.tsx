import { Download, Calendar, ArrowUpRight, Minus, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

const CHART_DATA = [
  { name: 'F&A', consolidated: 42, notConsolidated: 8 },
  { name: 'HR', consolidated: 28, notConsolidated: 21 },
  { name: 'SCM', consolidated: 38, notConsolidated: 15 },
  { name: 'Logistics', consolidated: 26, notConsolidated: 23 },
];

const TABLE_DATA = [
  { id: 1, majorPath: 'Order-to-Cash', subtitle: 'Invoice Generation', process: 'Automated Billing', dept: 'F&A', type: 'Transactional', score: 9.4, consolidate: 'YES' },
  { id: 2, majorPath: 'Talent Acquisition', subtitle: 'Candidate Screening', process: 'Interview Scheduling', dept: 'HR', type: 'Functional', score: 7.2, consolidate: 'YES' },
  { id: 3, majorPath: 'Inventory Mgmt', subtitle: 'Stock Auditing', process: 'Cycle Counting', dept: 'SCM', type: 'Analytics', score: 4.8, consolidate: 'NO' },
  { id: 4, majorPath: 'Fleet Operations', subtitle: 'Route Planning', process: 'Dynamic Dispatch', dept: 'Logistics', type: 'Transactional', score: 8.1, consolidate: 'YES' },
];

export function ProcessAnalytics() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 w-full flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Process Analytics</h1>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Sovereign Ledger <span className="mx-2 text-slate-300">›</span> Admin Console <span className="mx-2 text-slate-300">›</span> <span className="text-corporateBlue">Analytics Overview</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">
            <Calendar size={16} className="text-slate-500" />
            Last 30 Days
          </button>
          <button className="bg-corporateBlue hover:bg-corporateBlue-dark text-white text-sm font-bold py-2 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-corporateBlue"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <div className="w-4 h-4 text-corporateBlue flex grid grid-cols-2 gap-[1px]">
                  <div className="bg-current rounded-[2px]"></div><div className="bg-current rounded-[2px] opacity-40"></div>
                  <div className="bg-current rounded-[2px] opacity-40"></div><div className="bg-current rounded-[2px]"></div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">
                <ArrowUpRight size={12} /> +12%
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Processes</p>
            <h3 className="text-3xl font-extrabold text-slate-900">124</h3>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-corporateBlue/80"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <div className="w-4 h-4 bg-corporateBlue/80 rounded" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">
                <ArrowUpRight size={12} /> +8
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Consolidated</p>
            <h3 className="text-3xl font-extrabold text-slate-900">86</h3>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200"></div>
            <div className="flex justify-between items-start mb-4">
               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <div className="w-4 h-4 bg-slate-300 rounded line-through border border-white"></div>
              </div>
              <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">
                <Minus size={12} /> Neutral
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Not Consolidated</p>
            <h3 className="text-3xl font-extrabold text-slate-900">38</h3>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent revolve"></div>
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">
                <ArrowUpRight size={12} /> +2.4%
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Consolidation Rate</p>
            <h3 className="text-3xl font-extrabold text-slate-900 text-corporateBlue">69.3%</h3>
          </div>
        </div>

        {/* Charts & Maturity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">Departmental Breakdown</h3>
                <p className="text-sm text-slate-500">Consolidation status by core business units</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{value}</span>}
                  />
                  <Bar dataKey="consolidated" name="Consolidated" fill="#185FA5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="notConsolidated" name="Not Consolidated" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Maturity Metric */}
          <div className="bg-corporateBlue-dark rounded-xl shadow-xl border border-corporateBlue-dark overflow-hidden flex flex-col">
            <div className="p-8 flex-1">
               <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Process Maturity</h3>
               <p className="text-sm text-blue-200/80 mb-8 max-w-[200px] leading-relaxed">Real-time health of the ledger ecosystem.</p>

               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
                     <span>Transactional</span>
                     <span className="text-white">88%</span>
                   </div>
                   <div className="h-1.5 w-full bg-blue-900/50 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-400 rounded-full w-[88%]"></div>
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
                     <span>Functional</span>
                     <span className="text-white">64%</span>
                   </div>
                   <div className="h-1.5 w-full bg-blue-900/50 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-400 rounded-full w-[64%]"></div>
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
                     <span>Analytics</span>
                     <span className="text-white">42%</span>
                   </div>
                   <div className="h-1.5 w-full bg-blue-900/50 rounded-full overflow-hidden">
                     <div className="h-full bg-green-400 rounded-full w-[42%]"></div>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="bg-slate-900/40 p-6 border-t border-white/5">
              <p className="text-xs text-blue-200/70 italic leading-relaxed">
                "Transactional processes are leading the consolidation curve with near-total automation achieved this quarter."
              </p>
            </div>
          </div>
        </div>

        {/* Searchable Process Library */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-end flex-wrap gap-4">
             <div>
               <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Process Library</h3>
               <p className="text-sm text-slate-500">Comprehensive inventory and scoring matrix</p>
             </div>
             
             <div className="flex gap-3">
               <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest py-2 px-4 rounded-lg">
                 ALL DEPARTMENTS <ChevronDown size={14} />
               </button>
               <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest py-2 px-4 rounded-lg">
                 SORT BY: SCORE <ChevronDown size={14} />
               </button>
             </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-extrabold text-slate-400 tracking-widest uppercase border-b border-slate-100">
                    <th className="py-4 px-6 min-w-[200px]">MAJOR PROCESS</th>
                    <th className="py-4 px-6 min-w-[200px]">PROCESS</th>
                    <th className="py-4 px-6 min-w-[120px]">DEPARTMENT</th>
                    <th className="py-4 px-6 min-w-[150px]">TYPE</th>
                    <th className="py-4 px-6">SCORE</th>
                    <th className="py-4 px-6">CONSOLIDATE</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {TABLE_DATA.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6">
                        <p className="font-bold text-slate-900">{row.majorPath}</p>
                        <p className="text-xs text-slate-400">{row.subtitle}</p>
                      </td>
                      <td className="py-5 px-6 font-medium text-slate-600">{row.process}</td>
                      <td className="py-5 px-6">
                        <span className={`text-xs font-bold tracking-wider \${
                          row.dept === 'F&A' ? 'text-blue-600' :
                          row.dept === 'HR' ? 'text-purple-600' :
                          row.dept === 'SCM' ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>{row.dept}</span>
                      </td>
                      <td className="py-5 px-6 text-slate-600 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full \${
                          row.type === 'Transactional' ? 'bg-blue-500' :
                          row.type === 'Functional' ? 'bg-amber-500' : 'bg-green-500'
                        }`}></div>
                        {row.type}
                      </td>
                      <td className="py-5 px-6 font-extrabold text-slate-900">{row.score}</td>
                      <td className="py-5 px-6">
                         <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold tracking-widest \${
                           row.consolidate === 'YES' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                         }`}>
                           {row.consolidate}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
           
           {/* Pagination footer (Visual Only) */}
           <div className="px-6 py-4 flex items-center justify-between text-xs text-slate-500 font-medium">
             <p>Showing 4 of 124 processes</p>
             <div className="flex gap-1 font-bold">
               <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">&lt;</button>
               <button className="w-8 h-8 flex items-center justify-center rounded bg-corporateBlue text-white shadow-sm">1</button>
               <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50 text-slate-600">2</button>
               <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-50 text-slate-600">3</button>
               <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">&gt;</button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
