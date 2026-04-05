import { useState } from "react";
import { Lock } from "lucide-react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

export function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    alert("Form submitted to Sovereign Ledger successfully!");
    setCurrentStep(1); // Reset for demo purposes
  };

  return (
    <div className="max-w-6xl mx-auto w-full pt-8 pb-16 min-h-screen">
      {/* Wizard Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold text-corporateBlue tracking-widest uppercase mb-2">QUARTERLY FILING</p>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">BPER Form - Q1 2026</h1>
        </div>
        <div className="bg-blue-50 text-corporateBlue font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg border border-blue-100 flex items-center gap-2 shadow-sm">
          <Lock size={14} /> Secured Entry
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full relative shadow-sm rounded-xl">
        
        {/* Stepper Header */}
        <div className="bg-white rounded-t-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-8 w-full max-w-2xl px-4">
            
            {/* Step 1 */}
            <div className={`flex items-center gap-3 \${currentStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold \${currentStep >= 1 ? 'bg-corporateBlue text-white' : 'bg-slate-100 text-slate-500'}`}>
                1
              </div>
              <span className={`text-sm font-bold \${currentStep >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>Employee Details</span>
            </div>

            {/* Divider */}
            <div className={`h-px w-16 \${currentStep >= 2 ? 'bg-corporateBlue' : 'bg-slate-200'}`}></div>

            {/* Step 2 */}
            <div className={`flex items-center gap-3 \${currentStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold \${currentStep >= 2 ? 'bg-corporateBlue text-white' : 'bg-slate-100 text-slate-500'}`}>
                2
              </div>
              <span className={`text-sm font-bold \${currentStep >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>Process Details</span>
            </div>

            {/* Divider */}
             <div className={`h-px w-16 \${currentStep >= 3 ? 'bg-corporateBlue' : 'bg-slate-200'}`}></div>

            {/* Step 3 */}
            <div className={`flex items-center gap-3 \${currentStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold \${currentStep >= 3 ? 'bg-corporateBlue-dark text-white' : 'bg-slate-100 text-slate-500'}`}>
                3
              </div>
              <span className={`text-sm font-bold \${currentStep >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>Review</span>
            </div>

          </div>

          {/* AutoSaved Status */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4 border-l border-slate-200 hidden md:flex">
             Autosaved <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="relative -mt-px w-full z-0">
          {currentStep === 1 && <Step1 onNext={handleNext} onPrev={() => alert('Returning to Dashboard...')} />}
          {currentStep === 2 && <Step2 onNext={handleNext} onPrev={handlePrev} />}
          {currentStep === 3 && <Step3 onPrev={handlePrev} onSubmit={handleSubmit} />}
        </div>
      </div>

       <div className="text-center mt-12 mb-8">
         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sovereign Ledger Institutional Protocol © 2026</p>
       </div>
    </div>
  );
}
