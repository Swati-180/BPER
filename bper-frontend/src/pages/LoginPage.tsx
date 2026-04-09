import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { StandardErrorMessage } from "../components/StandardErrorMessage";
import { useErrorNotifier } from "../errors/ErrorProvider";

type DemoMode = "" | "admin" | "employee";

const DEMO_CREDENTIALS: Record<Exclude<DemoMode, "">, { email: string; password: string }> = {
  admin: { email: "admin.demo@bper.local", password: "Admin@123" },
  employee: { email: "employee.demo@bper.local", password: "Emp@12345" },
};

export function LoginPage() {
  const { login } = useAuth();
  const { pushSuccess } = useErrorNotifier();
  const [demoMode, setDemoMode] = useState<DemoMode>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      pushSuccess("Signed in successfully.");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Login failed.";
      if (/pending approval/i.test(message) || /inactive/i.test(message)) {
        setError("Your account is pending approval. Please wait for admin activation.");
      } else if (/invalid credentials/i.test(message)) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 grid place-items-center p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <p className="text-xs font-bold tracking-widest text-corporateBlue uppercase mb-2">BPER Platform</p>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Sign In</h1>
        <p className="text-sm text-slate-500 mb-6">Institutional access to BPER.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Demo Role (Testing)</label>
            <select
              value={demoMode}
              onChange={(e) => {
                const mode = e.target.value as DemoMode;
                setDemoMode(mode);
                setError("");

                if (mode) {
                  setEmail(DEMO_CREDENTIALS[mode].email);
                  setPassword(DEMO_CREDENTIALS[mode].password);
                }
              }}
              className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-corporateBlue"
            >
              <option value="">Custom / Backend Login</option>
              <option value="admin">Demo Admin</option>
              <option value="employee">Demo Employee</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Use this to enter without backend API.</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Work Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDemoMode("");
              }}
              placeholder="admin@qgtools.in"
              required
              className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-corporateBlue"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setDemoMode("");
              }}
              required
              className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-corporateBlue"
            />
          </div>

          <StandardErrorMessage message={error} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-corporateBlue hover:bg-corporateBlue-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Continue to Dashboard"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          New to BPER?{" "}
          <Link to="/request-access" className="text-corporateBlue font-semibold hover:underline">Request Access</Link>
        </p>
      </div>
    </div>
  );
}
