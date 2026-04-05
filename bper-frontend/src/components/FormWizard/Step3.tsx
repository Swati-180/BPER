import { Send, Save, CheckCircle2, Info } from "lucide-react";

interface StepProps {
  onPrev: () => void;
  onSubmit: () => void;
}

export function Step3({ onSubmit }: StepProps) {
  return (
    <div className="bg-white rounded-b-xl border-x border-b border-slate-200 shadow-sm font-sans flex flex-col md:flex-row min-h-[600px] relative">
      
      {/* Toast Notification (Mocked) */}
      <div className="absolute top-4 right-4 bg-green-50 border border-green-200 shadow-lg rounded-lg p-4 flex gap-4 z-50 w-80 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="mt-0.5"><div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center"><CheckCircle2 size={16}/></div></div>
        <div>
          <h4 className="text-sm font-bold text-green-900">Progress Saved</h4>
          <p className="text-xs text-green-700 mt-1">Last auto-save at 14:32:01</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 border-r border-slate-200">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Comprehensive Summary</h2>
          <p className="text-slate-500">
            Review all process metrics before final submission to the ledger.
          </p>
        </div>

        {/* Breakdown Group 1 */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-corporateBlue tracking-widest uppercase mb-4 bg-slate-50 p-2 border-l-2 border-corporateBlue">
            Major Process: Financial Governance
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-2">Sub-Process</th>
                <th className="pb-2 text-right">FTE Count</th>
                <th className="pb-2 text-right">Allocated Hours</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100">
                <td className="py-4 text-slate-700 font-medium">Quarterly Audit Compliance</td>
                <td className="py-4 text-right text-slate-500">4.5</td>
                <td className="py-4 text-right font-bold text-corporateBlue">720.0</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 text-slate-700 font-medium">Internal Controls Verification</td>
                <td className="py-4 text-right text-slate-500">2.0</td>
                <td className="py-4 text-right font-bold text-corporateBlue">320.0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Breakdown Group 2 */}
        <div className="mb-12">
          <h3 className="text-xs font-bold text-corporateBlue tracking-widest uppercase mb-4 bg-slate-50 p-2 border-l-2 border-corporateBlue">
            Major Process: Strategic Operations
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-2">Sub-Process</th>
                <th className="pb-2 text-right">FTE Count</th>
                <th className="pb-2 text-right">Allocated Hours</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100">
                <td className="py-4 text-slate-700 font-medium">Workforce Resource Optimization</td>
                <td className="py-4 text-right text-slate-500">6.0</td>
                <td className="py-4 text-right font-bold text-corporateBlue">960.0</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-4 text-slate-700 font-medium">Global Supply Chain Logistics</td>
                <td className="py-4 text-right text-slate-500">12.0</td>
                <td className="py-4 text-right font-bold text-corporateBlue">1,920.0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Certification Checkbox */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex gap-4 items-start">
          <div className="flex-shrink-0 mt-1">
             <input type="checkbox" className="w-5 h-5 accent-corporateBlue border-slate-300 rounded focus:ring-corporateBlue cursor-pointer" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1 cursor-pointer select-none">I certify these details are accurate</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              By checking this box, I confirm that the hours and FTE allocations reported above accurately reflect the institutional intelligence records for the current fiscal period.
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar Area */}
      <div className="w-full md:w-96 bg-slate-50/50 p-10 flex flex-col">
        
        {/* Main Metric Card */}
        <div className="bg-corporateBlue-dark rounded-xl shadow-lg overflow-hidden relative mb-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
          
          <div className="px-8 pt-8 pb-6 border-b border-white/10 relative">
            <p className="text-xs font-bold text-slate-300 tracking-widest uppercase mb-4 flex items-center gap-2">
              Calculated Total <Info size={14} className="opacity-50" />
            </p>
            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">3,920.0</h1>
            <p className="text-sm text-slate-300">Aggregate Allocated Hours</p>
          </div>

          <div className="px-8 py-5 bg-corporateBlue relative flex justify-between items-center">
             <div>
               <p className="text-[10px] font-bold text-slate-200 tracking-widest uppercase mb-1">Total FTE Equivalent</p>
               <p className="text-xl font-bold text-white">24.50</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-200 tracking-widest uppercase mb-1">Consistency</p>
                <div className="flex items-center gap-1.5 text-white bg-white/20 px-2 py-0.5 rounded text-xs font-bold">
                  <CheckCircle2 size={12} /> Verified
                </div>
             </div>
          </div>
        </div>

        {/* Metric Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-auto shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">Metric Breakdown</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Core Processes</span>
              <span className="font-bold text-slate-900">2,880.0h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Support Functions</span>
              <span className="font-bold text-slate-900">1,040.0h</span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-slate-600 font-bold">Draft ID</span>
              <span className="text-xs font-bold text-corporateBlue bg-blue-50 px-2 py-1 rounded">#BPER-2024-0892</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-8">
          <button 
            onClick={onSubmit}
            className="w-full bg-corporateBlue-dark hover:bg-corporateBlue text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-md"
          >
            <Send size={18} /> Submit BPER Form
          </button>
          <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3">
            <Save size={18} /> Save as Draft
          </button>
        </div>

      </div>
    </div>
  );
}
