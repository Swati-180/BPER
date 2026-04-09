import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  ChartColumnIncreasing,
  Clock3,
  Edit3,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Users,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/http";
import { EmptyState, ErrorFallbackState, LoadingState } from "../components/PageStates";

interface Me {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  grade?: string;
  title?: string;
  location?: string;
  tower?: { name?: string } | string;
  managerName?: string;
  managerTitle?: string;
  department?: { name?: string } | string;
  phone?: string;
}

interface SubmissionRow {
  _id: string;
  submittedAt?: string;
  totalHoursLogged?: number;
  month?: number;
  year?: number;
}

type ThemeMode = "system" | "light" | "dark";

const preferenceKey = "bper.profile.preferences";

export function ProfilePage() {
  const [me, setMe] = useState<Me>({});
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailReminderEnabled, setEmailReminderEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(preferenceKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { emailReminderEnabled?: boolean; themeMode?: ThemeMode };
      if (typeof parsed.emailReminderEnabled === "boolean") setEmailReminderEnabled(parsed.emailReminderEnabled);
      if (parsed.themeMode === "light" || parsed.themeMode === "dark" || parsed.themeMode === "system") setThemeMode(parsed.themeMode);
    } catch {
      // Keep default preferences if parsing fails.
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [profile, submissionRows] = await Promise.all([
          apiGet<Me>("/auth/me"),
          apiGet<SubmissionRow[]>("/eper/wdt/my-submissions"),
        ]);
        setMe(profile);
        setSubmissions(submissionRows || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Unable to load profile.");
        setMe({});
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    localStorage.setItem(preferenceKey, JSON.stringify({ emailReminderEnabled, themeMode }));
  }, [emailReminderEnabled, themeMode]);

  const displayName = me.name || "User Identity & Profile";
  const displayTitle = me.title || formatTitle(me.role) || "Employee";
  const department = formatField(me.department);
  const tower = formatField(me.tower);
  const roleLabel = capitalize(me.role || "employee");
  const initials = getInitials(displayName);

  const summary = useMemo(() => {
    const totalSubmissions = submissions.length;
    const lastSubmission = submissions[0] || null;
    const hours = submissions.map((row) => row.totalHoursLogged || 0).filter((value) => value > 0);
    const avgUtilization = hours.length > 0 ? (hours.reduce((sum, value) => sum + (value / 160) * 100, 0) / hours.length) : 0;
    const trend = hours.length > 1 ? hours[0] - hours[hours.length - 1] : 0;
    const complianceRate = totalSubmissions > 0 ? 100 : 0;

    return {
      totalSubmissions,
      complianceRate,
      avgUtilization,
      trend,
      latestLedgerEntry: lastSubmission?.submittedAt ? formatDate(lastSubmission.submittedAt) : "No ledger entries yet",
      lastSubmissionLabel: lastSubmission ? `Q${Math.floor(((lastSubmission.month || 1) - 1) / 3) + 1} ${lastSubmission.year || new Date().getFullYear()}` : "No records",
    };
  }, [submissions]);

  if (loading) {
    return <LoadingState title="Loading profile" message="Fetching your account details." />;
  }

  if (error) {
    return <ErrorFallbackState title="Profile unavailable" message={error} />;
  }

  if (!me.name && !me.email) {
    return <EmptyState title="Profile data not found" message="Your profile details are not available right now." />;
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 pb-14">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-corporateBlue font-semibold mb-2">BPER Profile</p>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">User Identity & Profile</h1>
        <p className="text-slate-600 mt-2 max-w-3xl">Reviewing active user credentials and institutional filing compliance metrics for the current fiscal period.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.9fr] gap-5">
        <section className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-corporateBlue to-blue-700 text-white flex items-center justify-center text-3xl font-semibold shadow-lg ring-2 ring-white border border-slate-200">
                {initials}
                <span className="absolute bottom-1.5 right-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">{displayName}</h2>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    <Shield size={12} className="text-corporateBlue" /> {roleLabel}
                  </span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">{displayTitle}</p>
                <p className="mt-2 text-sm text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-corporateBlue" /> {formatLocation(me.location)}</span>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness size={14} className="text-amber-700" /> {department}</span>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5"><Users size={14} className="text-violet-600" /> {tower}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:self-start">
                <a
                  href={`mailto:hr@company.com?subject=Update%20profile%20for%20${encodeURIComponent(displayName)}`}
                  className="inline-flex items-center gap-2 rounded-md bg-corporateBlue text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-corporateBlue-light transition-colors"
                >
                  <Edit3 size={16} /> Edit Profile
                </a>
                <a
                  href="mailto:it-support@company.com?subject=Password%20reset%20request"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <KeyRound size={16} /> Change Password
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SectionHeader icon={<UserRound size={16} />} title="Identification & Credentials" />
              <InfoList items={[
                { label: "Name", value: displayName, icon: <UserRound size={16} /> },
                { label: "Email", value: me.email || "-", icon: <Mail size={16} /> },
                { label: "Phone", value: me.phone || "Not set", icon: <Phone size={16} /> },
              ]} />
            </div>

            <div>
              <SectionHeader icon={<BriefcaseBusiness size={16} />} title="Employment Specifications" />
              <InfoList items={[
                { label: "Designation", value: displayTitle, icon: <BriefcaseBusiness size={16} /> },
                { label: "Pay Grade / Tier", value: me.grade ? `Grade ${me.grade}` : "Not set", icon: <ChartColumnIncreasing size={16} /> },
                { label: "Department", value: department, icon: <Users size={16} /> },
                { label: "Primary Location", value: formatLocation(me.location), icon: <MapPin size={16} /> },
              ]} />
            </div>

            <div>
              <SectionHeader icon={<Users size={16} />} title="Organizational Hierarchy" />
              <InfoList items={[
                { label: "Line Manager", value: me.managerName || "Not set", icon: <Users size={16} /> },
                { label: "Reporting Authority", value: me.managerTitle || "Not set", icon: <BriefcaseBusiness size={16} /> },
              ]} />
            </div>

            <div>
              <SectionHeader icon={<Sparkles size={16} />} title="System Preferences" />
              <div className="space-y-4 rounded-md border border-slate-200 bg-slate-50/70 p-4">
                <ToggleRow
                  title="Deadline Proximity Alerts"
                  description="Configure automated notifications for fiscal filing deadlines."
                  enabled={emailReminderEnabled}
                  onToggle={setEmailReminderEnabled}
                  icon={<BellRing size={16} />}
                />
                <div className="rounded-md border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Interface Mode</p>
                      <p className="text-sm text-slate-500 mt-1">System Default / Light / Dark</p>
                    </div>
                    <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
                      {(["system", "light", "dark"] as ThemeMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setThemeMode(mode)}
                          className={`min-w-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] rounded-md transition-colors ${themeMode === mode ? "bg-corporateBlue text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          {mode === "system" ? "System" : mode === "light" ? "Light" : "Dark"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-md shadow-sm p-6">
            <SectionHeader icon={<BarChart3 size={16} />} title="Submission Analytics / Filing History" />
            <div className="mt-5 space-y-3">
              <MetricRail label="Compliance Rate" value={`${summary.complianceRate}%`} meta="Fiscal Year 2026" accent="bg-emerald-500" />
              <MetricRail label="Avg. Utilization" value={`${summary.avgUtilization.toFixed(1)}%`} meta="Baseline: 160h" accent="bg-corporateBlue" />
              <MetricRail label="Ledger Status" value={summary.totalSubmissions > 0 ? "Synchronized" : "Awaiting entry"} meta={summary.lastSubmissionLabel} accent="bg-slate-500" />
              <MetricRail label="Latest Ledger Entry" value={summary.latestLedgerEntry} meta="Most recent filing captured in the portal" accent="bg-amber-500" />
            </div>

            <div className="mt-5 rounded-md border border-dashed border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Clock3 size={16} className="text-corporateBlue" />
                <p className="text-sm font-semibold text-slate-800">Ledger readiness</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {summary.totalSubmissions > 0
                  ? `You have ${summary.totalSubmissions} filing${summary.totalSubmissions === 1 ? "" : "s"} on record.`
                  : "No ledger entries have been recorded yet."}
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-r from-corporateBlue-dark via-[#0B2A55] to-blue-700 text-white rounded-md shadow-lg p-6 relative overflow-hidden">
            <div className="absolute inset-y-0 right-0 w-40 bg-white/5 blur-3xl rounded-full translate-x-16" aria-hidden="true" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-200 font-semibold mb-2">Cycle Readiness Module</p>
            <h3 className="text-2xl font-semibold tracking-tight mb-2">Filing Window Readiness</h3>
            <p className="text-sm text-blue-100/90 leading-relaxed mb-6">
              Update your contact details, manage reminders, and review your own activity metrics before the next filing window opens.
            </p>
            <Link
              to="/form"
              className="inline-flex items-center gap-2 rounded-md bg-white text-corporateBlue-dark px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Go to Form <CheckCircle2 size={16} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-md bg-slate-100 text-corporateBlue flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h2>
    </div>
  );
}

function InfoList({ items }: { items: Array<{ label: string; value: string; icon: ReactNode }> }) {
  return (
    <div className="divide-y divide-slate-100 border-t border-slate-100">
      {items.map((item) => (
        <div key={item.label} className="py-3 flex items-start gap-3">
          <div className="mt-0.5 text-slate-500 shrink-0">
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">{item.label}</p>
            </div>
            <p className="mt-1 text-[14px] font-medium text-slate-900 break-words">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
  icon,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 flex items-start gap-3">
      <div className="w-8 h-8 shrink-0 rounded-md bg-slate-100 text-corporateBlue flex items-center justify-center mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-corporateBlue" : "bg-slate-300"}`}
            aria-pressed={enabled}
            aria-label={title}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricRail({ label, value, meta, accent }: { label: string; value: string; meta: string; accent: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50/90 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-1 text-[14px] font-medium text-slate-900 break-words">{value}</p>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} aria-hidden="true" />
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full rounded-full ${accent}`} style={{ width: label === "Compliance Rate" ? "100%" : label === "Avg. Utilization" ? "64%" : label === "Ledger Status" ? "88%" : "72%" }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{meta}</p>
    </div>
  );
}

function formatLocation(location?: string) {
  return location || "Not set";
}

function formatField(value?: { name?: string } | string) {
  if (!value) return "Not set";
  return typeof value === "string" ? value : value.name || "Not set";
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ME"
  );
}

function capitalize(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function formatTitle(role?: string) {
  if (!role) return "Employee";
  return role === "employee"
    ? "Employee"
    : role === "supervisor"
      ? "Supervisor"
      : role === "tower_lead"
        ? "Tower Lead"
        : role === "admin"
          ? "Administrator"
          : capitalize(role);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No submissions yet";
  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" });
}
