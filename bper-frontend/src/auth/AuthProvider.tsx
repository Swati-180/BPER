import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, setAuthToken, setUnauthorizedHandler } from "../api/http";

type Role = "admin" | "tower_lead" | "supervisor" | "employee";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

interface DemoCredential {
  email: string;
  password: string;
  user: AuthUser;
}

const DEMO_TOKEN_PREFIX = "demo-token-";
const DEMO_USER_STORAGE_KEY = "demoUser";

const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    email: "admin.demo@bper.local",
    password: "Admin@123",
    user: {
      _id: "demo-admin-001",
      name: "Demo Admin",
      email: "admin.demo@bper.local",
      role: "admin",
    },
  },
  {
    email: "employee.demo@bper.local",
    password: "Emp@12345",
    user: {
      _id: "demo-employee-001",
      name: "Demo Employee",
      email: "employee.demo@bper.local",
      role: "employee",
    },
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const decodeJwtExpMs = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    if (!decoded?.exp) return null;
    return decoded.exp * 1000;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef<number | null>(null);

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearLogoutTimer();
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    navigate("/login", { replace: true });
  }, [clearLogoutTimer, navigate]);

  const scheduleAutoLogout = useCallback((jwtToken: string) => {
    clearLogoutTimer();
    const expMs = decodeJwtExpMs(jwtToken);
    if (!expMs) return;

    const delay = expMs - Date.now();
    if (delay <= 0) {
      logout();
      return;
    }

    logoutTimerRef.current = window.setTimeout(() => {
      logout();
    }, delay);
  }, [clearLogoutTimer, logout]);

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    const demoAccount = DEMO_CREDENTIALS.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password
    );

    if (demoAccount) {
      const demoToken = `${DEMO_TOKEN_PREFIX}${demoAccount.user.role}`;
      setAuthToken(demoToken);
      setToken(demoToken);
      setUser(demoAccount.user);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoAccount.user));

      if (demoAccount.user.role === "employee") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
      return;
    }

    const response = await apiPost<{ token: string; user: AuthUser }, LoginPayload>("/auth/login", { email, password });
    setAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    scheduleAutoLogout(response.token);

    if (response.user.role === "employee") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate, scheduleAutoLogout]);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "token" && event.key !== "authToken") return;

      const nextToken = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!nextToken) {
        clearLogoutTimer();
        setToken(null);
        setUser(null);
        navigate("/login", { replace: true });
        return;
      }

      setToken(nextToken);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [clearLogoutTimer, navigate]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (token.startsWith(DEMO_TOKEN_PREFIX)) {
        const rawDemoUser = localStorage.getItem(DEMO_USER_STORAGE_KEY);
        if (rawDemoUser) {
          try {
            const parsed = JSON.parse(rawDemoUser) as AuthUser;
            setUser(parsed);
            setLoading(false);
            return;
          } catch {
            localStorage.removeItem(DEMO_USER_STORAGE_KEY);
          }
        }

        setAuthToken(null);
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const me = await apiGet<AuthUser>("/auth/me");
        setUser(me);
        scheduleAutoLogout(token);
      } catch {
        setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [token, scheduleAutoLogout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      logout,
    }),
    [token, user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
