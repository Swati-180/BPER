import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:5000/api";
const DEMO_TOKEN_PREFIX = "demo-token-";
const DEMO_USER_STORAGE_KEY = "demoUser";

let unauthorizedHandler: (() => void) | null = null;
let globalErrorHandler: ((error: HttpErrorInfo) => void) | null = null;
let handlingUnauthorized = false;

export interface HttpErrorInfo {
  status?: number;
  message: string;
  method?: string;
  url?: string;
}

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

export const setGlobalErrorHandler = (handler: ((error: HttpErrorInfo) => void) | null) => {
  globalErrorHandler = handler;
};

const normalizeHttpError = (error: any): HttpErrorInfo => {
  const status = error?.response?.status;
  const method = error?.config?.method ? String(error.config.method).toUpperCase() : undefined;
  const url = error?.config?.url;
  const messageFromServer = error?.response?.data?.message;
  const message = messageFromServer || error?.message || "Something went wrong. Please try again.";

  return {
    status,
    message,
    method,
    url,
  };
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem("token") || localStorage.getItem("authToken");
};

const isDemoSession = () => {
  const token = getStoredToken();
  return Boolean(token && token.startsWith(DEMO_TOKEN_PREFIX));
};

type DemoRole = "admin" | "tower_lead" | "supervisor" | "employee";

interface DemoUser {
  _id: string;
  name: string;
  email: string;
  role: DemoRole;
  grade?: string;
  department?: { _id: string; code: string; name: string };
  tower?: { _id: string; name: string };
}

const getDemoUser = (): DemoUser => {
  const fallback: DemoUser = {
    _id: "demo-user-001",
    name: "Demo User",
    email: "demo@bper.local",
    role: "employee",
    grade: "L2",
    department: { _id: "dept-fa", code: "FA", name: "Finance & Accounts" },
    tower: { _id: "tower-ap", name: "Accounts Payable" },
  };

  try {
    const raw = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as DemoUser;
    return {
      ...fallback,
      ...parsed,
      department: parsed.department || fallback.department,
      tower: parsed.tower || fallback.tower,
    };
  } catch {
    return fallback;
  }
};

const nowIso = () => new Date().toISOString();

const demoHierarchy = [
  {
    _id: "tower-ap",
    name: "Accounts Payable",
    processes: [
      {
        _id: "proc-invoice",
        name: "Invoice Processing",
        activities: [
          { _id: "act-validate", name: "Validate Vendor Invoice" },
          { _id: "act-post", name: "Post Invoice In ERP" },
        ],
      },
      {
        _id: "proc-payment",
        name: "Payment Execution",
        activities: [{ _id: "act-payment", name: "Execute Weekly Payment Batch" }],
      },
    ],
  },
  {
    _id: "tower-otc",
    name: "Order To Cash",
    processes: [
      {
        _id: "proc-collections",
        name: "Collections",
        activities: [{ _id: "act-followup", name: "Customer Follow-up Calls" }],
      },
    ],
  },
];

const demoFlatActivities = demoHierarchy
  .flatMap((tower) => tower.processes)
  .flatMap((process) => process.activities)
  .map((activity) => ({ _id: activity._id, name: activity.name }));

let demoUsers: Array<{
  _id: string;
  name: string;
  email: string;
  role: DemoRole;
  grade?: string;
  isActive: boolean;
  department?: { name?: string } | string;
}> = [
  { _id: "user-admin-001", name: "Demo Admin", email: "admin.demo@bper.local", role: "admin", grade: "L4", isActive: true, department: { name: "Operations" } },
  { _id: "user-emp-001", name: "Demo Employee", email: "employee.demo@bper.local", role: "employee", grade: "L2", isActive: true, department: { name: "Finance & Accounts" } },
  { _id: "user-sup-001", name: "Demo Supervisor", email: "supervisor.demo@bper.local", role: "supervisor", grade: "L3", isActive: true, department: { name: "Finance & Accounts" } },
];

let demoPendingUsers: Array<{ _id: string; name: string; email: string; requestedRole: DemoRole; createdAt: string }> = [
  { _id: "pending-001", name: "Alex Pending", email: "alex.pending@bper.local", requestedRole: "employee", createdAt: nowIso() },
  { _id: "pending-002", name: "Taylor Pending", email: "taylor.pending@bper.local", requestedRole: "supervisor", createdAt: nowIso() },
];

let demoMySubmissions: Array<{
  _id: string;
  month: number;
  year: number;
  status: string;
  submittedAt?: string;
  createdAt?: string;
  revisionNote?: string;
  totalHoursLogged?: number;
  activities?: Array<{
    activity?: { _id?: string; name?: string };
    customText?: string;
    isCustom?: boolean;
    totalHoursMonth?: number;
    volumeMonthly?: number;
    timePerTransaction?: number;
    flaggedForRevision?: boolean;
    flagComment?: string;
    editPermissionRequested?: boolean;
    editPermissionReason?: string;
    editPermissionGranted?: boolean;
  }>;
}> = [
  {
    _id: "sub-demo-001",
    month: 4,
    year: 2026,
    status: "under_review",
    submittedAt: nowIso(),
    createdAt: nowIso(),
    revisionNote: "Looks good. Validate weekend allocation.",
    totalHoursLogged: 164,
    activities: [
      {
        activity: { _id: "act-validate", name: "Validate Vendor Invoice" },
        totalHoursMonth: 88,
        volumeMonthly: 440,
        timePerTransaction: 12,
      },
      {
        activity: { _id: "act-post", name: "Post Invoice In ERP" },
        totalHoursMonth: 56,
        volumeMonthly: 280,
        timePerTransaction: 12,
      },
      {
        isCustom: true,
        customText: "Monthly accrual reconciliations",
        totalHoursMonth: 20,
        volumeMonthly: 20,
        timePerTransaction: 60,
      },
    ],
  },
];

const demoTeamSubmissions = () => {
  const base = demoMySubmissions[0];
  return [
    {
      _id: base._id,
      employee: { name: "Demo Employee" },
      department: { code: "FA", name: "Finance & Accounts" },
      status: base.status,
      month: base.month,
      year: base.year,
      activities: base.activities,
      totalHoursLogged: base.totalHoursLogged,
      revisionNote: base.revisionNote,
      submittedAt: base.submittedAt,
      updatedAt: nowIso(),
    },
    {
      _id: "sub-demo-002",
      employee: { name: "Jordan Analyst" },
      department: { code: "HR", name: "Human Resources" },
      status: "approved",
      month: 4,
      year: 2026,
      activities: [
        { activity: { name: "Employee Onboarding" }, totalHoursMonth: 72 },
        { activity: { name: "Payroll Audits" }, totalHoursMonth: 66 },
      ],
      totalHoursLogged: 138,
      revisionNote: "Approved.",
      submittedAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];
};

const demoFteSummary = [
  { department: "Finance & Accounts", tower: "Accounts Payable", process: "Invoice Processing", activity: "Validate Vendor Invoice", currentFTE: 2.4, consolidate: true, totalScore: 8.4 },
  { department: "Finance & Accounts", tower: "Accounts Payable", process: "Payment Execution", activity: "Execute Weekly Payment Batch", currentFTE: 1.8, consolidate: false, totalScore: 6.1 },
  { department: "Human Resources", tower: "People Ops", process: "Onboarding", activity: "Employee Onboarding", currentFTE: 1.2, consolidate: true, totalScore: 7.8 },
  { department: "Human Resources", tower: "Payroll", process: "Compensation", activity: "Payroll Audits", currentFTE: 1.4, consolidate: false, totalScore: 5.9 },
];

const demoUtilization = [
  { employee: "Demo Employee", department: "Finance & Accounts", hoursLogged: 164, standardHours: 160, utilizationPct: 102.5, overtimeHours: 4, status: "under_review" },
  { employee: "Jordan Analyst", department: "Human Resources", hoursLogged: 146, standardHours: 160, utilizationPct: 91.3, overtimeHours: 0, status: "approved" },
  { employee: "Casey Lead", department: "Finance & Accounts", hoursLogged: 132, standardHours: 160, utilizationPct: 82.5, overtimeHours: 0, status: "submitted" },
];

const demoDashboardSummary = {
  totalEmployees: 24,
  submissionStats: {
    draft: 3,
    submitted: 8,
    underReview: 6,
    returned: 2,
    approved: 5,
  },
  avgUtilization: 0.87,
  fteByTower: [
    { tower: "Accounts Payable", totalFTE: 4.2 },
    { tower: "Payroll", totalFTE: 1.4 },
    { tower: "People Ops", totalFTE: 1.2 },
  ],
  consolidationSummary: {
    activities: 11,
    savedFTE: 1.8,
    costSaving: 1800000,
  },
};

const demoFitmentSummary = {
  counts: {
    Fit: 6,
    "Train to Fit": 5,
    "Low Fit": 2,
    Unfit: 1,
  },
  scores: [
    { employee: { name: "Demo Employee", department: { name: "Finance & Accounts" } }, weightedScore: 17.4, remark: "Fit" },
    { employee: { name: "Jordan Analyst", department: { name: "Human Resources" } }, weightedScore: 15.1, remark: "Train to Fit" },
  ],
};

const demoWindow = () => {
  const now = new Date();
  const close = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  return {
    openAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    closeAt: close.toISOString(),
    isOpen: true,
    now: now.toISOString(),
    remainingMs: close.getTime() - now.getTime(),
    message: "Submission window is open",
  };
};

const makeDemoResponse = (method: "GET" | "POST" | "PUT" | "PATCH", url: string, body?: unknown): unknown => {
  const me = getDemoUser();

  if (method === "GET" && url === "/auth/me") {
    return {
      ...me,
      managerName: "Demo Manager",
      managerTitle: "Operations Director",
      location: "Mumbai",
      title: me.role === "admin" ? "Platform Administrator" : "Process Analyst",
      tower: me.tower?.name,
    };
  }

  if (method === "GET" && url === "/auth/users") return demoUsers;
  if (method === "GET" && url === "/admin/pending-users") return demoPendingUsers;
  if (method === "GET" && url === "/admin/submission-window") return demoWindow();
  if (method === "GET" && url === "/eper/wdt/my") return demoMySubmissions;
  if (method === "GET" && url === "/eper/wdt/my-submissions") return demoMySubmissions;
  if (method === "GET" && url === "/eper/wdt/team") return demoTeamSubmissions();
  if (method === "GET" && url === "/eper/settings/standardHours") return { value: 160 };
  if (method === "GET" && /^\/eper\/activities\/by-department\//.test(url)) return demoHierarchy;
  if (method === "GET" && /^\/eper\/activities\/flat\//.test(url)) return demoFlatActivities;

  if (method === "GET" && url === "/eper/reports/dashboard-summary") return demoDashboardSummary;
  if (method === "GET" && url === "/eper/reports/fte-summary") return demoFteSummary;
  if (method === "GET" && url === "/eper/reports/utilization") return demoUtilization;
  if (method === "GET" && url === "/eper/reports/fitment-summary") return demoFitmentSummary;
  if (method === "GET" && url === "/eper/reports/fte-consolidation-summary") {
    return {
      totalFTEOnConsolidatable: 5.6,
      estimatedSavedFTE: 1.8,
      estimatedAnnualSaving: 1800000,
    };
  }

  if (method === "GET" && url === "/eper/fitment/team") {
    return demoUsers
      .filter((user) => user.role === "employee")
      .map((user) => ({
        employee: {
          _id: user._id,
          name: user.name,
          grade: user.grade,
          department: typeof user.department === "string" ? user.department : user.department?.name,
        },
        remark: "Fit",
      }));
  }

  if (method === "POST" && url === "/eper/ai/map-activity") {
    return {
      mappedActivityId: "act-validate",
      mappedActivityName: "Validate Vendor Invoice",
      confidence: 0.92,
    };
  }

  if (method === "POST" && url === "/auth/register") {
    const input = (body || {}) as { name?: string; email?: string; role?: DemoRole; grade?: string };
    const next = {
      _id: `user-${Date.now()}`,
      name: input.name || "Demo User",
      email: input.email || `demo-${Date.now()}@bper.local`,
      role: input.role || "employee",
      grade: input.grade || "",
      isActive: true,
      department: { name: "Finance & Accounts" },
    };
    demoUsers = [next, ...demoUsers];
    return { message: "User created successfully.", userId: next._id };
  }

  if (method === "POST" && url === "/auth/request-access") {
    const input = (body || {}) as { name?: string; email?: string; requestedRole?: DemoRole };
    const next = {
      _id: `pending-${Date.now()}`,
      name: input.name || "Requested User",
      email: input.email || `request-${Date.now()}@bper.local`,
      requestedRole: input.requestedRole || "employee",
      createdAt: nowIso(),
    };
    demoPendingUsers = [next, ...demoPendingUsers];
    return { message: "Access request submitted. Awaiting admin approval.", userId: next._id };
  }

  if (method === "PATCH" && /^\/admin\/users\/.+\/(approve|reject)$/.test(url)) {
    const parts = url.split("/");
    const id = parts[3];
    const action = parts[4];
    const pending = demoPendingUsers.find((user) => user._id === id);
    demoPendingUsers = demoPendingUsers.filter((user) => user._id !== id);
    if (pending && action === "approve") {
      demoUsers = [
        {
          _id: pending._id,
          name: pending.name,
          email: pending.email,
          role: pending.requestedRole,
          isActive: true,
          grade: "L1",
          department: { name: "Finance & Accounts" },
        },
        ...demoUsers,
      ];
    }
    return { message: action === "approve" ? "User approved" : "User rejected" };
  }

  if (method === "PATCH" && /^\/eper\/wdt\/.+\/status$/.test(url)) {
    const input = (body || {}) as { status?: string; comment?: string };
    const id = url.split("/")[3];
    demoMySubmissions = demoMySubmissions.map((row) =>
      row._id === id
        ? {
            ...row,
            status: input.status || row.status,
            revisionNote: input.comment || row.revisionNote,
            updatedAt: nowIso(),
          }
        : row
    );
    return { message: "Submission status updated." };
  }

  if (method === "POST" && url === "/eper/wdt/draft") {
    return { message: "Draft saved." };
  }

  if (method === "POST" && url === "/eper/wdt/submit") {
    const payload = (body || {}) as { month?: number; year?: number; activities?: Array<Record<string, unknown>> };
    const created = {
      _id: `sub-demo-${Date.now()}`,
      month: payload.month || new Date().getMonth() + 1,
      year: payload.year || new Date().getFullYear(),
      status: "submitted",
      submittedAt: nowIso(),
      createdAt: nowIso(),
      totalHoursLogged: 160,
      activities: (payload.activities || []) as Array<{
        activity?: { _id?: string; name?: string };
        customText?: string;
        isCustom?: boolean;
        totalHoursMonth?: number;
      }> ,
    };
    demoMySubmissions = [created, ...demoMySubmissions];
    return { message: "Submission completed." };
  }

  if (method === "POST" && (url === "/eper/sixbysix/score" || url === "/eper/fitment/score")) {
    return { message: "Score saved." };
  }

  if (method === "PUT" && (/^\/eper\/wdt\/flag\/.+/.test(url) || /^\/eper\/wdt\/grant-edit\/.+/.test(url))) {
    return { message: "Update saved." };
  }

  return {};
};

const maybeDemoRequest = async <T>(method: "GET" | "POST" | "PUT" | "PATCH", url: string, body?: unknown): Promise<T | null> => {
  if (!isDemoSession()) return null;
  const data = makeDemoResponse(method, url, body) as T;
  return Promise.resolve(data);
};

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeHttpError(error);

    if (normalized.status === 401) {
      setAuthToken(null);

      if (!handlingUnauthorized && unauthorizedHandler) {
        handlingUnauthorized = true;
        unauthorizedHandler();
        window.setTimeout(() => {
          handlingUnauthorized = false;
        }, 300);
      }
    }

    const isCanceled = error?.code === "ERR_CANCELED";
    if (!isCanceled && globalErrorHandler && normalized.status !== 401) {
      globalErrorHandler(normalized);
    }

    return Promise.reject(error);
  }
);

export const apiGet = async <T>(url: string): Promise<T> => {
  const demo = await maybeDemoRequest<T>("GET", url);
  if (demo !== null) return demo;
  const { data } = await api.get<T>(url);
  return data;
};

export const apiPost = async <T, B = unknown>(url: string, body: B): Promise<T> => {
  const demo = await maybeDemoRequest<T>("POST", url, body);
  if (demo !== null) return demo;
  const { data } = await api.post<T>(url, body);
  return data;
};

export const apiPut = async <T, B = unknown>(url: string, body: B): Promise<T> => {
  const demo = await maybeDemoRequest<T>("PUT", url, body);
  if (demo !== null) return demo;
  const { data } = await api.put<T>(url, body);
  return data;
};

export const apiPatch = async <T, B = unknown>(url: string, body?: B): Promise<T> => {
  const demo = await maybeDemoRequest<T>("PATCH", url, body);
  if (demo !== null) return demo;
  const { data } = await api.patch<T>(url, body);
  return data;
};
