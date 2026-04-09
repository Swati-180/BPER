import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { apiGet } from "../../api/http";

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function Step1({ onNext, onPrev }: StepProps) {
  const [me, setMe] = useState<{
    _id: string;
    name: string;
    email: string;
    grade?: string;
    title?: string;
    location?: string;
    tower?: string;
    managerName?: string;
    managerTitle?: string;
    department?: { name?: string } | string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet<{
          _id: string;
          name: string;
          email: string;
          grade?: string;
          title?: string;
          location?: string;
          tower?: string;
          managerName?: string;
          managerTitle?: string;
          department?: { name?: string } | string;
        }>("/auth/me");
        setMe(data);
      } catch {
        setMe(null);
      }
    };
    void load();
  }, []);

  const fieldClass = "space-y-1.5";
  const labelClass = "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500";
  const valueClass = "text-[15px] font-medium text-slate-900";
  const employeeIdValue = me?._id ? me._id.toUpperCase() : "-";

  return (
    <div className="bg-white rounded-b-md border-x border-b border-slate-200 shadow-sm p-8 sm:p-10 font-sans">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 mb-2">Verified profile snapshot</p>
          <h2 className="text-2xl font-semibold text-slate-900">Employee Verification</h2>
        </div>
        <p className="max-w-2xl text-sm text-slate-500 leading-relaxed">
          Review your read-only profile before entering process data. These fields are pulled from master records and should match your institutional profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-7 mb-10">
        <div className={fieldClass}>
          <p className={labelClass}>Employee ID</p>
          <p className={`${valueClass} font-mono tabular-nums break-all`}>{employeeIdValue}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Name</p>
          <p className={valueClass}>{me?.name || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Institutional Email</p>
          <p className={valueClass}>{me?.email || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Title</p>
          <p className={valueClass}>{me?.title || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Department</p>
          <p className={valueClass}>{typeof me?.department === "string" ? me.department : me?.department?.name || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Primary Location</p>
          <p className={valueClass}>{me?.location || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Primary Tower / Function</p>
          <p className={valueClass}>{me?.tower || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Pay Band / Grade</p>
          <p className={`${valueClass} font-mono tabular-nums`}>{me?.grade ? `Grade ${me.grade}` : "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Supervisor Name</p>
          <p className={valueClass}>{me?.managerName || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Supervisor Title</p>
          <p className={valueClass}>{me?.managerTitle || "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Employee Type</p>
          <p className={`${valueClass} text-corporateBlue`}>{me ? "From employee profile" : "-"}</p>
        </div>
        <div className={fieldClass}>
          <p className={labelClass}>Assigned Client</p>
          <p className={valueClass}>{typeof me?.department === "string" ? me.department : me?.department?.name || "-"}</p>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="mailto:bper-support@company.com?subject=BPER%20Profile%20Discrepancy"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800"
        >
          <AlertTriangle size={16} /> Report a discrepancy
        </a>
        <button 
          onClick={onPrev}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
        <button 
          onClick={onNext}
          className="bg-corporateBlue hover:bg-corporateBlue-light text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center gap-2 shadow-sm"
        >
          Confirm & Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
