import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2, Box } from "lucide-react";

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

interface ProcessRowData {
  id: number;
  majorProcess: string;
  process: string;
  subProcess: string;
  frequency: string;
  vol: number;
  hrs: number;
  appUsed: string;
}

interface MiscTaskData {
  id: number;
  description: string;
  hrs: number;
}

export function Step2({ onNext, onPrev }: StepProps) {
  const [processRows, setProcessRows] = useState<ProcessRowData[]>([
    { id: 1, majorProcess: 'Commercial L', process: 'Underwriting', subProcess: 'Risk Assessmen', frequency: 'Daily', vol: 150, hrs: 45, appUsed: 'Salesforce, Excel' },
    { id: 2, majorProcess: 'Customer Sup', process: 'Inbound Querie', subProcess: 'Technical Help', frequency: 'Daily', vol: 420, hrs: 120, appUsed: 'Zendesk' },
  ]);

  const [miscRows, setMiscRows] = useState<MiscTaskData[]>([
    { id: 1, description: '', hrs: 0 }
  ]);

  const totalProcessHours = processRows.reduce((acc, row) => acc + (row.hrs || 0), 0);
  const totalMiscHours = miscRows.reduce((acc, row) => acc + (row.hrs || 0), 0);
  const aggregateMonthlyEffort = totalProcessHours + totalMiscHours;

  const addProcessRow = () => {
    setProcessRows([...processRows, { id: Date.now(), majorProcess: 'Select...', process: 'Select...', subProcess: 'Select...', frequency: 'Daily', vol: 0, hrs: 0, appUsed: '' }]);
  };

  const removeProcessRow = (id: number) => {
    setProcessRows(processRows.filter(r => r.id !== id));
  };
  
  const updateProcessRow = (id: number, field: keyof ProcessRowData, value: string | number) => {
    setProcessRows(processRows.map(row => row.id === id ? { ...row, [field]: value } : row));
  }

  const addMiscRow = () => {
    setMiscRows([...miscRows, { id: Date.now(), description: '', hrs: 0 }]);
  };

  const removeMiscRow = (id: number) => {
    setMiscRows(miscRows.filter(r => r.id !== id));
  };
  
  const updateMiscRow = (id: number, field: keyof MiscTaskData, value: string | number) => {
    setMiscRows(miscRows.map(row => row.id === id ? { ...row, [field]: value } : row));
  }

  return (
    <div className="bg-white rounded-b-xl border-x border-b border-slate-200 shadow-sm font-sans flex flex-col">
      <div className="p-10 flex-1">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Process Inventory</h2>
          <p className="text-slate-500">Specify operational workflows, monthly volumes, and time requirements for each process.</p>
        </div>

        {/* Process Table */}
        <div className="w-full mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase border-b-2 border-slate-100">
                <th className="pb-4 px-3 w-[15%]">MAJOR PROCESS</th>
                <th className="pb-4 px-3 w-[15%]">PROCESS</th>
                <th className="pb-4 px-3 w-[15%]">SUB PROCESS</th>
                <th className="pb-4 px-3 w-32">FREQUENCY</th>
                <th className="pb-4 px-3 text-center w-24">VOL/MO</th>
                <th className="pb-4 px-3 text-center w-24">HRS/MO</th>
                <th className="pb-4 px-3 w-40">APP USED</th>
                <th className="pb-4 pr-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {processRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-4 px-2">
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 outline-none focus:border-corporateBlue appearance-none"
                      value={row.majorProcess}
                      onChange={(e) => updateProcessRow(row.id, 'majorProcess', e.target.value)}
                    >
                      <option>{row.majorProcess !== 'Select...' ? row.majorProcess : 'Select...'}</option>
                      <option>Commercial L</option>
                      <option>Customer Sup</option>
                    </select>
                  </td>
                  <td className="py-4 px-2">
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 outline-none focus:border-corporateBlue appearance-none"
                      value={row.process}
                      onChange={(e) => updateProcessRow(row.id, 'process', e.target.value)}
                    >
                      <option>{row.process !== 'Select...' ? row.process : 'Select...'}</option>
                      <option>Underwriting</option>
                      <option>Inbound Querie</option>
                    </select>
                  </td>
                  <td className="py-4 px-2">
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 outline-none focus:border-corporateBlue appearance-none"
                      value={row.subProcess}
                      onChange={(e) => updateProcessRow(row.id, 'subProcess', e.target.value)}
                    >
                      <option>{row.subProcess !== 'Select...' ? row.subProcess : 'Select...'}</option>
                      <option>Risk Assessmen</option>
                      <option>Technical Help</option>
                    </select>
                  </td>
                  <td className="py-4 px-2">
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 outline-none focus:border-corporateBlue appearance-none"
                      value={row.frequency}
                      onChange={(e) => updateProcessRow(row.id, 'frequency', e.target.value)}
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-center text-sm text-slate-700 outline-none focus:border-corporateBlue" 
                      value={row.vol || ''}
                      onChange={(e) => updateProcessRow(row.id, 'vol', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-center text-sm font-bold text-corporateBlue outline-none focus:border-corporateBlue" 
                      value={row.hrs || ''}
                      onChange={(e) => updateProcessRow(row.id, 'hrs', Number(e.target.value))}
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 outline-none focus:border-corporateBlue" 
                      placeholder="e.g. Workday"
                      value={row.appUsed}
                      onChange={(e) => updateProcessRow(row.id, 'appUsed', e.target.value)}
                    />
                  </td>
                  <td className="py-4 pl-2 text-right">
                    <button onClick={() => removeProcessRow(row.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="flex justify-center mb-10">
          <button 
            onClick={addProcessRow}
            className="text-corporateBlue font-bold text-sm bg-blue-50 border border-dashed border-blue-200 py-3 px-8 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add New Process Row
          </button>
        </div>

        {/* Miscellaneous Tasks Section */}
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-corporateBlue"><Box size={20} className="fill-corporateBlue/20" /></div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-widest uppercase">Miscellaneous Activities</h3>
          </div>
          
          <div className="w-full mb-6">
            <div className="flex text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-3 px-2">
              <div className="flex-1">Activity Description</div>
              <div className="w-48 text-center pr-12">Time Taken (Hrs/Month)</div>
            </div>
            
            <div className="space-y-3">
              {miscRows.map((row) => (
                <div key={row.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                     <textarea 
                        className="w-full bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-700 outline-none focus:border-corporateBlue resize-none shadow-sm h-16"
                        placeholder="Ad-hoc meetings, administrative filing, or unique seasonal tasks..."
                        value={row.description}
                        onChange={(e) => updateMiscRow(row.id, 'description', e.target.value)}
                     ></textarea>
                  </div>
                  <div className="w-48 flex items-start gap-4">
                     <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-corporateBlue opacity-50">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <input 
                           type="number" 
                           className="w-full bg-white border border-slate-200 rounded-lg p-4 pl-12 text-lg font-bold text-slate-900 outline-none focus:border-corporateBlue shadow-sm h-16" 
                           value={row.hrs || ''}
                           onChange={(e) => updateMiscRow(row.id, 'hrs', Number(e.target.value))}
                        />
                     </div>
                     <button onClick={() => removeMiscRow(row.id)} className="text-slate-400 hover:text-red-500 transition-colors mt-5 p-1 shrink-0">
                        <Trash2 size={20} />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
             onClick={addMiscRow}
             className="text-corporateBlue hover:text-corporateBlue-dark transition-colors font-bold text-sm flex items-center gap-1.5 px-2"
          >
             <Plus size={16} strokeWidth={3} /> Add Miscellaneous Activity
          </button>
        </div>

      </div>

      {/* Modern Calculation Footer Anchor */}
      <div className="bg-white border-t border-slate-200 p-6 px-10 flex items-center justify-between rounded-b-xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-8 border-r border-slate-200 pr-8">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total Monthly Effort</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-corporateBlue leading-none">{aggregateMonthlyEffort.toFixed(2)}</span>
              <span className="text-sm font-bold text-slate-500 mb-0.5">hrs / month</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8">
           <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full inline-flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-extrabold uppercase tracking-widest">Live Calculation Active</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onPrev}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button 
            onClick={onNext}
            className="bg-corporateBlue hover:bg-corporateBlue-dark text-white font-bold py-3.5 px-8 rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            Next: Review & Submit <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
