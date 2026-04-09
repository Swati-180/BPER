import { Loader2, AlertTriangle, Inbox } from "lucide-react";

interface StateProps {
  title: string;
  message: string;
}

export function LoadingState({ title, message }: StateProps) {
  return (
    <div className="min-h-[320px] grid place-items-center p-6">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-corporateBlue mx-auto mb-3" />
        <p className="text-base font-bold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500 mt-1">{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, message }: StateProps) {
  return (
    <div className="min-h-[320px] grid place-items-center p-6">
      <div className="text-center max-w-md">
        <Inbox className="h-8 w-8 text-slate-400 mx-auto mb-3" />
        <p className="text-base font-bold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500 mt-1">{message}</p>
      </div>
    </div>
  );
}

export function ErrorFallbackState({ title, message }: StateProps) {
  return (
    <div className="min-h-[320px] grid place-items-center p-6">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
        <p className="text-base font-bold text-red-700">{title}</p>
        <p className="text-sm text-slate-600 mt-1">{message}</p>
      </div>
    </div>
  );
}
