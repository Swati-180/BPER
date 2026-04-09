export interface SubmissionWindow {
  openAt: string;
  closeAt: string;
  isOpen: boolean;
  now: string;
  remainingMs: number;
  message: string;
}

export function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}
