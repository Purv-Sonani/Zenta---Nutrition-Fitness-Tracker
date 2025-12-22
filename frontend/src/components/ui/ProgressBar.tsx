interface ProgressBarProps {
  value: number; // 0 - 100
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="w-full h-2 bg-(--surface-muted) rounded-full overflow-hidden">
      <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}
