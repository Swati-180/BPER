interface StandardErrorMessageProps {
  message?: string;
  className?: string;
}

export function StandardErrorMessage({ message, className = "" }: StandardErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`border border-red-200 bg-red-50 text-red-700 rounded-lg px-3 py-2 text-sm font-medium ${className}`}>
      {message}
    </div>
  );
}
