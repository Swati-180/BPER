export type UnifiedStatus = "draft" | "submitted" | "review" | "returned" | "approved";

const STATUS_META: Record<UnifiedStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-700 border-slate-200" },
  submitted: { label: "Submitted", cls: "bg-blue-100 text-blue-800 border-blue-200" },
  review: { label: "Under Review", cls: "bg-amber-100 text-amber-900 border-amber-300" },
  returned: { label: "Returned for Revision", cls: "bg-rose-100 text-rose-800 border-rose-200" },
  approved: { label: "Final Approval Granted", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export function StatusBadge({ status }: { status: UnifiedStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${meta.cls}`}>
      {meta.label}
    </span>
  );
}

export function mapBackendStatusToUnified(
  status: "draft" | "submitted" | "under_review" | "returned_for_revision" | "approved" | string
): UnifiedStatus {
  if (status === "draft") return "draft";
  if (status === "submitted") return "submitted";
  if (status === "under_review") return "review";
  if (status === "returned_for_revision") return "returned";
  if (status === "approved") return "approved";
  return "draft";
}
