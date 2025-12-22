import clsx from "clsx";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-sm", className)}>{children}</div>;
}
