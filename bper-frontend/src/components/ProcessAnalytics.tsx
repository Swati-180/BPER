import { useEffect, useMemo, useState } from "react";
import { Download, Calendar, ArrowUpRight, Users, IndianRupee } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { apiGet } from "../api/http";
import { EmptyState, ErrorFallbackState, LoadingState } from "./PageStates";

interface FteRow {
  department: string;
  tower: string;
  process: string;
  activity: string;
  currentFTE: number;
  consolidate: boolean;
  totalScore: number;
}

interface DashboardSummary {
  submissionStats: {
    draft: number;
    submitted: number;
    underReview: number;
    returned: number;
    approved: number;
  };
  avgUtilization: number;
}

interface FteConsolidationSummary {
  totalFTEOnConsolidatable: number;
  estimatedSavedFTE: number;
  estimatedAnnualSaving: number;
}

const safeNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export function ProcessAnalytics() {
  const [fteSummary, setFteSummary] = useState<FteRow[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [consolidationSummary, setConsolidationSummary] = useState<FteConsolidationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [fteData, dashData, consolidationData] = await Promise.all([
          apiGet<FteRow[]>("/eper/reports/fte-summary"),
          apiGet<DashboardSummary>("/eper/reports/dashboard-summary"),
          apiGet<FteConsolidationSummary>("/eper/reports/fte-consolidation-summary"),
        ]);

        setFteSummary(Array.isArray(fteData) ? fteData : []);
        setDashboardSummary(dashData || null);
        setConsolidationSummary(consolidationData || null);
      } catch {
        setError("Unable to load analytics reports.");
        setFteSummary([]);
        setDashboardSummary(null);
        setConsolidationSummary(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const totals = useMemo(() => {
    const total = fteSummary.length;
    const consolidatable = fteSummary.filter((row) => row.consolidate).length;
    const notConsolidatable = total - consolidatable;
    return { total, consolidatable, notConsolidatable };
  }, [fteSummary]);

  const chartData = useMemo(() => {
    const bucket = new Map<string, { consolidated: number; notConsolidated: number }>();

    fteSummary.forEach((row) => {
      const name = (row.department || "Unknown").trim() || "Unknown";
      const current = bucket.get(name) || { consolidated: 0, notConsolidated: 0 };
      if (row.consolidate) current.consolidated += 1;
      else current.notConsolidated += 1;
      bucket.set(name, current);
    });

    return Array.from(bucket.entries()).map(([name, value]) => ({
      name,
      consolidated: safeNumber(value.consolidated),
      notConsolidated: safeNumber(value.notConsolidated),
    }));
  }, [fteSummary]);

  const tableData = useMemo(() => {
    return fteSummary.slice(0, 25).map((row, idx) => ({
      id: idx + 1,
      majorPath: row.process || "Unknown",
      subtitle: row.activity || "Unknown",
      process: row.activity || "Unknown",
      dept: row.department || "Unknown",
      type: row.consolidate ? "Consolidatable" : "Non-Consolidatable",
      score: safeNumber(row.totalScore),
      consolidate: row.consolidate ? "YES" : "NO",
      fte: safeNumber(row.currentFTE).toFixed(2),
    }));
  }, [fteSummary]);

  const maturity = useMemo(() => {
    const stats = dashboardSummary?.submissionStats;
    const totalSub = stats
      ? safeNumber(stats.draft) + safeNumber(stats.submitted) + safeNumber(stats.underReview) + safeNumber(stats.returned) + safeNumber(stats.approved)
      : 0;
    const inFlow = stats ? safeNumber(stats.submitted) + safeNumber(stats.underReview) + safeNumber(stats.returned) + safeNumber(stats.approved) : 0;
    const transactional = totalSub > 0 ? (inFlow / totalSub) * 100 : 0;

    const functional = safeNumber(dashboardSummary?.avgUtilization) * 100;

    const highScoreCount = fteSummary.filter((row) => safeNumber(row.totalScore) >= 8).length;
    const analytics = fteSummary.length > 0 ? (highScoreCount / fteSummary.length) * 100 : 0;

    return {
      transactional: Math.max(0, Math.min(100, transactional)),
      functional: Math.max(0, Math.min(100, functional)),
      analytics: Math.max(0, Math.min(100, analytics)),
    };
  }, [dashboardSummary, fteSummary]);

  const annualSavingLakhs = ((safeNumber(consolidationSummary?.estimatedAnnualSaving) / 100000) || 0).toFixed(0);
  const hasChartData = chartData.length > 0;
  const hasTableData = tableData.length > 0;

  if (loading) {
    return <LoadingState title="Loading analytics" message="Preparing process and consolidation reports." />;
  }

  if (error) {
    return <ErrorFallbackState title="Analytics unavailable" message={error} />;
  }

  if (!hasChartData && !hasTableData) {
    return <EmptyState title="No analytics data" message="No report data is available to render process analytics." />;
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen overflow-auto">
      <div className="bg-white border-b border-slate-200 px-8 py-6 w-full flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Process Analytics</h1>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            BPER <span className="mx-2 text-slate-300">›</span> Admin Console <span className="mx-2 text-slate-300">›</span> <span className="text-corporateBlue">Analytics Overview</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-colors">
            <Calendar size={16} className="text-slate-500" />
            Latest Data
          </button>
          <button className="bg-corporateBlue hover:bg-corporateBlue-dark text-white text-sm font-bold py-2 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1400px] mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard label="Total Processes" value={String(totals.total)} accent="blue" />
          <MetricCard label="Consolidated" value={String(totals.consolidatable)} accent="indigo" />
          <MetricCard label="Not Consolidated" value={String(totals.notConsolidatable)} accent="slate" />
          <MetricCard
            label="Consolidation Rate"
            value={`${totals.total > 0 ? ((totals.consolidatable / totals.total) * 100).toFixed(1) : "0.0"}%`}
            accent="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">FTE Savings</p>
                <p className="text-xs text-slate-400">Headcount Optimization</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current FTE</span>
                <span className="font-semibold text-slate-800">{safeNumber(consolidationSummary?.totalFTEOnConsolidatable).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Estimated Post</span>
                <span className="font-semibold text-slate-800">{(safeNumber(consolidationSummary?.totalFTEOnConsolidatable) - safeNumber(consolidationSummary?.estimatedSavedFTE)).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Saved FTE</span>
                <span className="text-xl font-extrabold text-blue-600">{safeNumber(consolidationSummary?.estimatedSavedFTE).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <IndianRupee size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Cost Savings</p>
                <p className="text-xs text-slate-400">Annual Projection</p>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-amber-600 mb-1">₹{annualSavingLakhs}L</p>
            <p className="text-xs text-slate-400 mb-4">Est. Annual Savings</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, totals.total > 0 ? (totals.consolidatable / totals.total) * 100 : 0))}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Based on consolidation ratio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">Departmental Breakdown</h3>
                <p className="text-sm text-slate-500">Consolidation status by business units</p>
              </div>
            </div>

            <div className="h-72 w-full">
              {hasChartData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={false} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" formatter={(value) => <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{value}</span>} />
                    <Bar dataKey="consolidated" name="Consolidated" fill="#185FA5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="notConsolidated" name="Not Consolidated" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ChartEmptyState text="No departmental data available for chart." />
              )}
            </div>
          </div>

          <div className="bg-corporateBlue-dark rounded-xl shadow-xl border border-corporateBlue-dark overflow-hidden flex flex-col">
            <div className="p-8 flex-1">
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Process Maturity</h3>
              <p className="text-sm text-blue-200/80 mb-8 max-w-[200px] leading-relaxed">Derived from live reporting health and scoring.</p>

              <MaturityBar label="Transactional" pct={maturity.transactional} tone="blue" />
              <MaturityBar label="Functional" pct={maturity.functional} tone="amber" />
              <MaturityBar label="Analytics" pct={maturity.analytics} tone="green" />
            </div>

            <div className="bg-slate-900/40 p-6 border-t border-white/5">
              <p className="text-xs text-blue-200/70 italic leading-relaxed">
                Metrics update from /api/eper/reports/dashboard-summary and /api/eper/reports/fte-summary.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-end flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Process Library</h3>
              <p className="text-sm text-slate-500">Inventory with live FTE and consolidation scoring</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-extrabold text-slate-400 tracking-widest uppercase border-b border-slate-100">
                  <th className="py-4 px-6 min-w-[200px]">Major Process</th>
                  <th className="py-4 px-6 min-w-[200px]">Process</th>
                  <th className="py-4 px-6 min-w-[120px]">Department</th>
                  <th className="py-4 px-6 min-w-[150px]">Type</th>
                  <th className="py-4 px-6 text-center">FTE</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Consolidate</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {hasTableData ? (
                  tableData.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6">
                        <p className="font-bold text-slate-900">{row.majorPath}</p>
                        <p className="text-xs text-slate-400">{row.subtitle}</p>
                      </td>
                      <td className="py-5 px-6 font-medium text-slate-600">{row.process}</td>
                      <td className="py-5 px-6">
                        <span className="text-xs font-bold tracking-wider text-blue-600">{row.dept}</span>
                      </td>
                      <td className="py-5 px-6 text-slate-600">{row.type}</td>
                      <td className="py-5 px-6 text-center font-extrabold text-corporateBlue">{row.fte}</td>
                      <td className="py-5 px-6 font-extrabold text-slate-900">{row.score.toFixed(1)}</td>
                      <td className="py-5 px-6">
                        <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold tracking-widest ${row.consolidate === "YES" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {row.consolidate}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">No process records available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between text-xs text-slate-500 font-medium">
            <p>Showing {tableData.length} of {tableData.length} processes</p>
            <span className="font-bold text-slate-400">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: "blue" | "indigo" | "slate" | "amber" }) {
  const accentMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${accentMap[accent]}`}>
        <ArrowUpRight size={14} />
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
    </div>
  );
}

function MaturityBar({ label, pct, tone }: { label: string; pct: number; tone: "blue" | "amber" | "green" }) {
  const barColor = tone === "blue" ? "bg-blue-400" : tone === "amber" ? "bg-amber-400" : "bg-green-400";
  const safePct = Math.max(0, Math.min(100, safeNumber(pct)));

  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">
        <span>{label}</span>
        <span className="text-white">{safePct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full bg-blue-900/50 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${safePct}%` }}></div>
      </div>
    </div>
  );
}

function ChartEmptyState({ text }: { text: string }) {
  return <div className="h-full w-full grid place-items-center text-sm text-slate-500">{text}</div>;
}
