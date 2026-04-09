import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, X } from "lucide-react";
import { setGlobalErrorHandler, type HttpErrorInfo } from "../api/http";

type ToastType = "error" | "success" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ErrorContextValue {
  pushError: (message: string) => void;
  pushSuccess: (message: string) => void;
  pushInfo: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  useEffect(() => {
    const handler = (error: HttpErrorInfo) => {
      pushToast("error", error.message || "Request failed.");
    };

    setGlobalErrorHandler(handler);
    return () => setGlobalErrorHandler(null);
  }, [pushToast]);

  const value = useMemo<ErrorContextValue>(() => ({
    pushError: (message: string) => pushToast("error", message),
    pushSuccess: (message: string) => pushToast("success", message),
    pushInfo: (message: string) => pushToast("info", message),
  }), [pushToast]);

  return (
    <ErrorContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[100] space-y-2 w-[320px] max-w-[calc(100vw-2rem)]">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ErrorContext.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const style =
    toast.type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : toast.type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <div className={`border rounded-lg shadow-md px-3 py-2.5 flex items-start gap-2 ${style}`}>
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <p className="text-sm font-semibold leading-snug flex-1">{toast.message}</p>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

export function useErrorNotifier() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorNotifier must be used within ErrorProvider");
  }
  return context;
}
