import { useEffect, useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { apiGet, apiPatch } from "../api/http";
import { EmptyState, ErrorFallbackState, LoadingState } from "./PageStates";

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  requestedRole: "admin" | "tower_lead" | "supervisor" | "employee";
  createdAt?: string;
}

export function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPendingUsers = async () => {
    try {
      const data = await apiGet<PendingUser[]>("/admin/pending-users");
      setPendingUsers(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load pending users.");
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPendingUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pendingUsers;

    return pendingUsers.filter((user) =>
      [user.name, user.email, user.requestedRole].join(" ").toLowerCase().includes(q)
    );
  }, [pendingUsers, search]);

  if (loading) {
    return <LoadingState title="Loading pending users" message="Fetching access requests for approval." />;
  }

  if (error) {
    return <ErrorFallbackState title="Pending users unavailable" message={error} />;
  }

  if (pendingUsers.length === 0) {
    return <EmptyState title="No pending requests" message="All access requests are already processed." />;
  }

  const approveUser = async (id: string) => {
    setBusyId(id);
    try {
      await apiPatch(`/admin/users/${id}/approve`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const rejectUser = async (id: string) => {
    setBusyId(id);
    try {
      await apiPatch(`/admin/users/${id}/reject`);
      setPendingUsers((prev) => prev.filter((u) => u._id !== id));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pending User Approvals</h1>
          <p className="text-slate-600 mt-2">Review and action all access requests from /api/admin/pending-users.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-corporateBlue"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-slate-500 bg-slate-50 border-b border-slate-100">
                <th className="py-3 px-4 md:px-6">Name</th>
                <th className="py-3 px-4 md:px-6">Email</th>
                <th className="py-3 px-4 md:px-6">RequestedRole</th>
                <th className="py-3 px-4 md:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const isBusy = busyId === user._id;
                return (
                  <tr key={user._id} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 px-4 md:px-6 font-semibold text-slate-900">{user.name}</td>
                    <td className="py-4 px-4 md:px-6 text-slate-700">{user.email}</td>
                    <td className="py-4 px-4 md:px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                        {user.requestedRole.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 md:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => void approveUser(user._id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => void rejectUser(user._id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">No pending users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
