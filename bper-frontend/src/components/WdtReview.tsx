import { useEffect, useMemo, useState } from "react";
import { Flag, Check, ChevronRight, Bell, Download, Printer } from "lucide-react";
import { apiGet, apiPatch, apiPut } from "../api/http";
import { useAuth } from "../auth/AuthProvider";
import { EmptyState, ErrorFallbackState, LoadingState } from "./PageStates";
import { mapBackendStatusToUnified, StatusBadge } from "./StatusBadge";

type SubmissionStatus = "under_review" | "submitted" | "returned_for_revision" | "approved" | "draft";

interface ActivityEntry {
  category: string;
  description: string;
  hours: number;
  flagged: boolean;
  flagComment: string;
  editPermissionRequested: boolean;
  editPermissionReason: string;
  editPermissionGranted: boolean;
}

interface WdtEntry {
  id: string;
  employeeName: string;
  initials: string;
  department: string;
  status: SubmissionStatus;
  weekEnding: string;
  activities: ActivityEntry[];
  selfNarrative: string;
  totalHours: number;
  flagsRaised: number;
  submittedAt?: string;
  updatedAt?: string;
}

interface RawSubmission {
  _id: string;
  employee?: { name?: string };
  department?: { code?: string; name?: string };
  status: SubmissionStatus;
  month?: number;
  year?: number;
  activities?: Array<{
    activity?: { name?: string };
    customText?: string;
    totalHoursMonth?: number;
    flaggedForRevision?: boolean;
    flagComment?: string;
    editPermissionRequested?: boolean;
    editPermissionReason?: string;
    editPermissionGranted?: boolean;
  }>;
  totalHoursLogged?: number;
  revisionNote?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export function WdtReview() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<WdtEntry[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [flaggingIdx, setFlaggingIdx] = useState<number | null>(null);
  const [flagText, setFlagText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubmissions = async () => {
    try {
      const data = await apiGet<RawSubmission[]>("/eper/wdt/team");
      const mapped: WdtEntry[] = data.map((sub) => {
        const employeeName = sub.employee?.name || "Unknown";
        const initials = employeeName.split(" ").map((part) => part[0] || "").join("").slice(0, 2).toUpperCase() || "NA";
        const activities = (sub.activities || []).map((row) => ({
          category: row.activity?.name || row.customText || "Unmapped Activity",
          description: row.activity?.name || row.customText || "No description",
          hours: Number((row.totalHoursMonth || 0).toFixed(1)),
          flagged: Boolean(row.flaggedForRevision),
          flagComment: row.flagComment || "",
          editPermissionRequested: Boolean(row.editPermissionRequested),
          editPermissionReason: row.editPermissionReason || "",
          editPermissionGranted: Boolean(row.editPermissionGranted),
        }));

        return {
          id: sub._id,
          employeeName,
          initials,
          department: sub.department?.code || sub.department?.name || "Unknown",
          status: sub.status,
          weekEnding: `${sub.month || "-"}/${sub.year || "-"}`,
          activities,
          selfNarrative: sub.revisionNote || "No additional notes.",
          totalHours: Number((sub.totalHoursLogged || 0).toFixed(1)),
          flagsRaised: activities.filter((a) => a.flagged).length,
          submittedAt: sub.submittedAt,
          updatedAt: sub.updatedAt,
        };
      });

      setSubmissions(mapped);
      setActiveId((prev) => prev || mapped[0]?.id || "");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load team submissions.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubmissions();
  }, []);

  const active = useMemo(() => submissions.find(s => s.id === activeId), [submissions, activeId]);
  const pendingEditRequests = active ? active.activities.filter(a => a.editPermissionRequested && !a.editPermissionGranted).length : 0;
  const teamStats = useMemo(() => {
    const total = submissions.length;
    const approved = submissions.filter((s) => s.status === "approved").length;
    const reviewable = submissions.filter((s) => s.status !== "draft");
    const submissionRate = total > 0 ? (reviewable.length / total) * 100 : 0;
    const compliance = total > 0 ? (approved / total) * 100 : 0;
    const totalFlags = submissions.reduce((sum, row) => sum + row.flagsRaised, 0);
    const flagFrequency = total > 0 ? totalFlags / total : 0;

    const durations = submissions
      .map((row) => {
        const start = row.submittedAt ? new Date(row.submittedAt).getTime() : NaN;
        const end = row.updatedAt ? new Date(row.updatedAt).getTime() : NaN;
        if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
        return (end - start) / (1000 * 60 * 60);
      })
      .filter((value): value is number => value !== null);

    const avgTurnaround = durations.length
      ? durations.reduce((sum, value) => sum + value, 0) / durations.length
      : 0;

    return {
      avgTurnaround,
      submissionRate,
      flagFrequency,
      compliance,
    };
  }, [submissions]);

  const updateSubmission = (updated: WdtEntry) => {
    setSubmissions(subs => subs.map(s => s.id === updated.id ? updated : s));
  };

  const handleApprove = async () => {
    if (!active) return;
    await apiPatch(`/eper/wdt/${active.id}/status`, { status: "approved" });
    updateSubmission({ ...active, status: "approved" });
    setShowApproveModal(false);
  };

  const handleReturn = async () => {
    if (!active) return;
    await apiPatch(`/eper/wdt/${active.id}/status`, {
      status: "returned_for_revision",
      comment: "Returned by reviewer.",
    });
    updateSubmission({ ...active, status: "returned_for_revision" });
  };

  const handleSaveFlag = async (idx: number) => {
    if (!active) return;
    await apiPut(`/eper/wdt/flag/${active.id}`, { flags: [{ activityIndex: idx, flagComment: flagText }] });
    const updated = { ...active };
    updated.activities[idx] = { ...updated.activities[idx], flagged: true, flagComment: flagText };
    updated.flagsRaised = updated.activities.filter(a => a.flagged).length;
    updateSubmission(updated);
    setFlaggingIdx(null);
    setFlagText("");
  };

  const handleGrantEdit = async (idx: number, granted: boolean) => {
    if (!active) return;
    await apiPut(`/eper/wdt/grant-edit/${active.id}`, { activityIndex: idx, granted });
    const updated = { ...active };
    updated.activities[idx] = { ...updated.activities[idx], editPermissionGranted: granted, editPermissionRequested: !granted };
    updateSubmission(updated);
  };

  if (loading) {
    return <LoadingState title="Loading review queue" message="Fetching team submissions for manager review." />;
  }

  if (error) {
    return <ErrorFallbackState title="Review queue unavailable" message={error} />;
  }

  if (submissions.length === 0) {
    return <EmptyState title="No team submissions" message="No submissions are currently available for review." />;
  }

  if (!active) {
    return <EmptyState title="No selected submission" message="Select a submission from the queue to review details." />;
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex flex-col overflow-auto">
      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">Approve Submission?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">This will mark <strong>{active.employeeName}</strong>'s WDT submission as approved. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={handleApprove} className="flex-1 bg-corporateBlue text-white font-bold py-3 rounded-xl hover:bg-corporateBlue-dark shadow-sm">Confirm Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Review Queue</h1>
          <span className="text-xs text-slate-400 font-semibold">Team Submissions</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-slate-500 hover:text-slate-800">
            <Bell size={20} />
            {pendingEditRequests > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{pendingEditRequests}</span>
            )}
          </button>
          <div className="w-9 h-9 rounded-full bg-corporateBlue-dark text-white flex items-center justify-center text-xs font-bold">{(user?.name || "Manager").split(" ").map((part) => part[0] || "").join("").slice(0, 2).toUpperCase()}</div>
          <span className="text-sm font-semibold text-slate-700">{user?.name || "Manager"}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-auto">
        {/* Left Panel — Queue */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 px-4 pt-3">
            <button className="flex-1 text-sm font-bold text-corporateBlue border-b-2 border-corporateBlue pb-2.5">
              Pending ({submissions.filter(s => s.status !== "approved").length})
            </button>
            <button className="flex-1 text-sm font-medium text-slate-400 pb-2.5">History</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {submissions.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveId(sub.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${activeId === sub.id ? "border-corporateBlue/30 bg-blue-50/40 shadow-sm" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">{sub.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{sub.employeeName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{sub.department}</p>
                  </div>
                  {sub.status === "under_review" && <ChevronRight size={16} className="text-corporateBlue shrink-0" />}
                </div>
                <StatusBadge status={mapBackendStatusToUnified(sub.status)} />
                {sub.status === "under_review" && (
                  <p className="text-[10px] text-slate-500 mt-2 italic truncate">{sub.selfNarrative}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel — Detail */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-3xl mx-auto pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-corporateBlue">WDT Detailed Analysis</h2>
                <p className="text-sm text-slate-500 mt-0.5">Employee: {active.employeeName} · Week Ending {active.weekEnding}</p>
              </div>
              <div className="flex gap-2">
                <button className="border border-slate-200 text-slate-500 p-2 rounded-lg hover:bg-slate-50"><Printer size={16} /></button>
                <button className="border border-slate-200 text-slate-500 p-2 rounded-lg hover:bg-slate-50"><Download size={16} /></button>
              </div>
            </div>

            {/* Edit requests banner */}
            {pendingEditRequests > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex items-center gap-3 text-sm">
                <Bell size={16} className="text-amber-600 shrink-0" />
                <span className="font-semibold text-amber-800">{pendingEditRequests} edit request{pendingEditRequests > 1 ? "s" : ""} pending review — see rows below.</span>
              </div>
            )}

            {/* Activity rows */}
            <div className="space-y-4">
              {active.activities.map((act, idx) => (
                <div key={idx} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${act.flagged ? "border-red-200" : "border-slate-200"}`}>
                  <div className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-corporateBlue mb-1">{act.category}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{act.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-lg font-extrabold text-slate-900">{act.hours.toFixed(1)}</span>
                      {act.flagged ? (
                        <span className="w-8 h-8 flex items-center justify-center text-red-500"><Flag size={18} fill="currentColor" /></span>
                      ) : (
                        <button
                          onClick={() => { setFlaggingIdx(idx); setFlagText(""); }}
                          className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <Flag size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Edit permission request */}
                  {act.editPermissionRequested && !act.editPermissionGranted && (
                    <div className="bg-amber-50 border-t border-amber-200 px-5 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-extrabold text-amber-700 tracking-widest uppercase mb-0.5">Edit Permission Requested</p>
                        <p className="text-xs text-slate-600">Reason: {act.editPermissionReason}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleGrantEdit(idx, false)} className="text-xs font-bold text-slate-600 border border-slate-300 py-1.5 px-3 rounded-lg hover:bg-slate-50">Deny</button>
                        <button onClick={() => handleGrantEdit(idx, true)} className="text-xs font-bold text-white bg-corporateBlue-dark py-1.5 px-3 rounded-lg hover:bg-corporateBlue">Grant Edit Access</button>
                      </div>
                    </div>
                  )}
                  {act.editPermissionGranted && (
                    <div className="bg-green-50 border-t border-green-200 px-5 py-2">
                      <p className="text-xs font-bold text-green-700">✓ Edit access granted for this row.</p>
                    </div>
                  )}

                  {/* Flag form */}
                  {flaggingIdx === idx && (
                    <div className="bg-red-50 border-t border-red-200 p-5">
                      <p className="text-[10px] font-extrabold text-red-700 tracking-widest uppercase mb-2">Supervisor Revision Request</p>
                      <textarea
                        className="w-full bg-white border border-red-200 rounded-lg p-3 text-sm text-slate-700 outline-none focus:border-red-400 resize-none h-20"
                        placeholder="Please clarify if this coordination included the weekend surge shift..."
                        value={flagText}
                        onChange={e => setFlagText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setFlaggingIdx(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700">Discard</button>
                        <button onClick={() => handleSaveFlag(idx)} className="text-xs font-bold bg-red-600 text-white py-1.5 px-4 rounded-lg hover:bg-red-700">Save Flag</button>
                      </div>
                    </div>
                  )}

                  {/* Existing flag comment */}
                  {act.flagged && act.flagComment && flaggingIdx !== idx && (
                    <div className="bg-red-50 border-t border-red-200 px-5 py-3">
                      <p className="text-[10px] font-extrabold text-red-700 tracking-widest uppercase mb-1">Flagged</p>
                      <p className="text-xs text-slate-600">{act.flagComment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Self-Assessment */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase mb-2">Self-Assessment Narrative</p>
                <p className="text-sm text-slate-600 leading-relaxed">{active.selfNarrative}</p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-2">📎</div>
                <p className="text-xs text-slate-400">No additional documents attached.</p>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="fixed bottom-0 right-0 left-0 md:left-72 bg-white border-t border-slate-200 px-4 md:px-8 py-4 z-10">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex gap-6 md:gap-8 text-xs">
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">Total Hours</p>
                  <p className="text-xl font-extrabold text-slate-900">{active.totalHours.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">Flags Raised</p>
                  <p className="text-xl font-extrabold text-red-600">{String(active.flagsRaised).padStart(2, '0')}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="hidden lg:grid grid-cols-4 gap-4 text-center mr-6 border-r border-slate-200 pr-6">
                  {[
                    ["AVG TURNAROUND", `${teamStats.avgTurnaround.toFixed(1)} Hours`],
                    ["SUBMISSION RATE", `${teamStats.submissionRate.toFixed(0)}%`],
                    ["FLAG FREQUENCY", teamStats.flagFrequency.toFixed(2)],
                    ["TEAM COMPLIANCE", `${teamStats.compliance.toFixed(0)}%`],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[8px] font-extrabold text-slate-400 tracking-widest uppercase">{label}</p>
                      <p className={`text-sm font-extrabold ${label === "FLAG FREQUENCY" ? "text-red-600" : label === "TEAM COMPLIANCE" ? "text-green-600" : "text-slate-900"}`}>{String(val)}</p>
                    </div>
                  ))}
                </div>
                {["submitted", "under_review"].includes(active.status) && (
                  <>
                    <button onClick={handleReturn} className="border border-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 text-sm">
                      Return for Revision
                    </button>
                    <button onClick={() => setShowApproveModal(true)} className="bg-corporateBlue-dark hover:bg-corporateBlue text-white font-bold py-3 px-6 rounded-xl shadow-sm text-sm flex items-center gap-2">
                      <Check size={16} /> Approve Submission
                    </button>
                  </>
                )}
                {active.status === "approved" && (
                  <span className="bg-green-100 text-green-700 font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2">
                    <Check size={16} /> Approved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
