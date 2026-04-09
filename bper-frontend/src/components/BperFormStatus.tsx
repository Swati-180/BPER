import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, PencilLine, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/http";
import { EmptyState, ErrorFallbackState, LoadingState } from "./PageStates";

interface MySubmission {
  _id: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  status: "draft" | "submitted" | "under_review" | "returned_for_revision" | "approved";
  revisionNote?: string;
}

type TimelineState = "done" | "current" | "pending";

type TimelineStep = {
  key: string;
  label: string;
  dateText: string;
  state: TimelineState;
};

type CompactStatusMeta = {
  label: string;
  dotClass: string;
  progressClass: string;
  progressPct: number;
};

export function BperFormStatus() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<MySubmission[]>([]);
  const [query, setQuery] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet<MySubmission[]>("/eper/wdt/my-submissions");
        setSubmissions(data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Unable to load form status.");
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return submissions;

    return submissions.filter((row) => {
      const formId = formatFormId(row._id).toLowerCase();
      const status = formatStatus(row.status).toLowerCase();
      const comments = (row.revisionNote || "").toLowerCase();
      const date = formatDate(row.submittedAt || row.createdAt || row.updatedAt).toLowerCase();
      return formId.includes(q) || status.includes(q) || comments.includes(q) || date.includes(q);
    });
  }, [submissions, query]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedSubmissionId("");
      return;
    }

    const selectedStillVisible = filtered.some((row) => row._id === selectedSubmissionId);
    if (!selectedStillVisible) {
      setSelectedSubmissionId(filtered[0]._id);
    }
  }, [filtered, selectedSubmissionId]);

  const selectedSubmission = useMemo(() => {
    if (!filtered.length) return null;
    return filtered.find((row) => row._id === selectedSubmissionId) || filtered[0];
  }, [filtered, selectedSubmissionId]);

  const timeline = useMemo(() => buildTimeline(selectedSubmission), [selectedSubmission]);
  const actionableCount = submissions.filter((row) => row.status === "draft" || row.status === "returned_for_revision").length;

  if (loading) {
    return <LoadingState title="Loading form status" message="Fetching your submission timeline." />;
  }

  if (error) {
    return <ErrorFallbackState title="Could not load status" message={error} />;
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        title="No submissions yet"
        message="You haven't submitted any forms for this period yet. Start your first BPER form to see tracking, timeline, and revision history."
      />
    );
  }

  return (
    <div className="min-h-full bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 pb-12">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[24px] font-bold text-slate-900 tracking-tight">BPER Form Status</h1>
              {actionableCount > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                  <AlertTriangle size={14} className="text-amber-600" />
                  {actionableCount} form{actionableCount === 1 ? "" : "s"} require{actionableCount === 1 ? "s" : ""} attention
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">Track the selected submission, review its timeline, and act on any requested changes.</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Click a row to update the timeline</p>
        </div>

        <section className="bg-white border border-slate-200 rounded-lg p-4 md:p-5 mb-4 shadow-none">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Timeline Reference</h2>
              <p className="text-xs text-slate-500 mt-1">This reflects the currently selected record.</p>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {selectedSubmission ? formatFormId(selectedSubmission._id) : "No record selected"}
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-start">
            {timeline.map((step, index) => (
              <div key={step.key} className="flex-1 flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
                <div className="flex md:flex-col items-center md:items-center gap-2 md:gap-0 shrink-0">
                  <div
                    className={`relative h-4 w-4 rounded-full border-2 ${step.state === "done" ? "bg-corporateBlue border-corporateBlue" : step.state === "current" ? "bg-white border-corporateBlue" : "bg-white border-slate-300"}`}
                  >
                    {step.state === "current" && <span className="absolute inset-[-4px] rounded-full border border-corporateBlue/40 animate-pulse" aria-hidden="true" />}
                  </div>
                  {index < timeline.length - 1 && <div className="md:hidden h-6 w-px bg-slate-200" aria-hidden="true" />}
                </div>

                <div className="min-w-0 pb-4 md:pb-0 md:pr-4">
                  <p className={`text-sm font-semibold ${step.state === "current" ? "text-slate-900" : "text-slate-700"}`}>{step.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.dateText}</p>
                </div>

                {index < timeline.length - 1 && <div className="hidden md:block flex-1 h-px bg-slate-200 mt-2.5" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg shadow-none overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Submission Records</h2>
              <p className="text-sm text-slate-500">Reference ID, status, progress, comments, and the next action.</p>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search records"
                className="w-full pl-10 pr-3 py-2.5 rounded-md border border-slate-200 bg-white text-sm outline-none focus:border-corporateBlue"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[14px] font-semibold text-slate-500">
                  <th className="py-3 px-4 md:px-6">Reference ID</th>
                  <th className="py-3 px-4 md:px-6">Date</th>
                  <th className="py-3 px-4 md:px-6">Status</th>
                  <th className="py-3 px-4 md:px-6">Progress</th>
                  <th className="py-3 px-4 md:px-6">Comments</th>
                  <th className="py-3 px-4 md:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const isSelected = row._id === selectedSubmission?._id;
                  const statusMeta = getCompactStatus(row.status);
                  const isActionable = row.status === "draft" || row.status === "returned_for_revision";

                  return (
                    <tr
                      key={row._id}
                      className={`border-b border-slate-200 last:border-0 cursor-pointer transition-colors ${isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"}`}
                      onClick={() => setSelectedSubmissionId(row._id)}
                      role="button"
                      tabIndex={0}
                      aria-selected={isSelected}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedSubmissionId(row._id);
                        }
                      }}
                    >
                      <td className="py-3 px-4 md:px-6 font-medium text-blue-700">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedSubmissionId(row._id);
                          }}
                          className="hover:underline"
                        >
                          {formatFormId(row._id)}
                        </button>
                      </td>
                      <td className="py-3 px-4 md:px-6 text-[13px] text-slate-700">{formatDate(row.submittedAt || row.createdAt || row.updatedAt)}</td>
                      <td className="py-3 px-4 md:px-6">
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700">
                          <span className={`h-2 w-2 rounded-full ${statusMeta.dotClass}`} />
                          <span>{statusMeta.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 md:px-6">
                        <div className="w-28">
                          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div className={`h-full rounded-full ${statusMeta.progressClass}`} style={{ width: `${statusMeta.progressPct}%` }} />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{statusMeta.progressPct}%</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 md:px-6 text-[13px] text-slate-600">{row.revisionNote?.trim() || <span className="text-slate-400">No comments yet</span>}</td>
                      <td className="py-3 px-4 md:px-6 text-right">
                        {isActionable ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate("/form", { state: { resumeSubmissionId: row._id } });
                            }}
                            className="text-sm font-semibold text-corporateBlue hover:text-corporateBlue-dark inline-flex items-center gap-2"
                          >
                            Review & Edit <PencilLine size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedSubmissionId(row._id);
                            }}
                            className="text-sm font-semibold text-slate-500 hover:text-corporateBlue"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">No submissions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function buildTimeline(selectedSubmission: MySubmission | null): TimelineStep[] {
  const status = selectedSubmission?.status || "draft";
  const submittedAt = formatDate(selectedSubmission?.submittedAt || selectedSubmission?.createdAt || selectedSubmission?.updatedAt);
  const reviewAt = status === "under_review" || status === "returned_for_revision" || status === "approved"
    ? formatDate(selectedSubmission?.updatedAt || selectedSubmission?.submittedAt || selectedSubmission?.createdAt)
    : "Pending";
  const decisionAt = status === "approved" || status === "returned_for_revision"
    ? formatDate(selectedSubmission?.updatedAt || selectedSubmission?.submittedAt || selectedSubmission?.createdAt)
    : "Pending";

  return [
    {
      key: "submitted",
      label: "Submitted",
      dateText: submittedAt,
      state: status === "draft" ? "current" : "done",
    },
    {
      key: "review",
      label: "Under Review",
      dateText: reviewAt,
      state: status === "under_review" ? "current" : status === "returned_for_revision" || status === "approved" ? "done" : status === "submitted" ? "current" : "pending",
    },
    {
      key: "decision",
      label: "Final Decision",
      dateText: decisionAt,
      state: status === "approved" || status === "returned_for_revision" ? "current" : "pending",
    },
  ];
}

function getCompactStatus(status: MySubmission["status"] | string): CompactStatusMeta {
  if (status === "approved") {
    return { label: "Final Approval Granted", dotClass: "bg-emerald-500", progressClass: "bg-emerald-500", progressPct: 100 };
  }
  if (status === "returned_for_revision") {
    return { label: "Returned for Revision", dotClass: "bg-rose-500", progressClass: "bg-sky-500", progressPct: 85 };
  }
  if (status === "under_review") {
    return { label: "Under Review", dotClass: "bg-amber-500", progressClass: "bg-sky-500", progressPct: 70 };
  }
  if (status === "submitted") {
    return { label: "Submitted", dotClass: "bg-sky-500", progressClass: "bg-sky-500", progressPct: 55 };
  }
  return { label: "Draft", dotClass: "bg-slate-400", progressClass: "bg-slate-400", progressPct: 25 };
}

function formatStatus(status: MySubmission["status"]): string {
  if (status === "draft") return "Draft";
  if (status === "submitted") return "Submitted";
  if (status === "under_review") return "Under Review";
  if (status === "returned_for_revision") return "Returned for Revision";
  if (status === "approved") return "Final Approval Granted";
  return "Draft";
}

function formatDate(value?: string): string {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" });
}

function formatFormId(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}
