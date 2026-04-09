import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../api/http";
import { StandardErrorMessage } from "../components/StandardErrorMessage";
import { useErrorNotifier } from "../errors/ErrorProvider";

export function RequestAccessPage() {
  const navigate = useNavigate();
  const { pushSuccess } = useErrorNotifier();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiPost("/auth/request-access", { name, email, password, grade });
      setSuccess("Request submitted successfully. Redirecting to login...");
      pushSuccess("Access request submitted.");
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to submit request access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 grid place-items-center p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <p className="text-xs font-bold tracking-widest text-corporateBlue uppercase mb-2">BPER Platform</p>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Request Access</h1>
        <p className="text-sm text-slate-500 mb-6">Create your access request for BPER approval.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-corporateBlue" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Work Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-corporateBlue" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-corporateBlue" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Grade (Optional)</label>
            <input value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-corporateBlue" />
          </div>

          <StandardErrorMessage message={error} />
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-corporateBlue hover:bg-corporateBlue-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Already have access?{" "}
          <Link to="/login" className="text-corporateBlue font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
