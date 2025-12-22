import clsx from "clsx";
import { DashboardStatus } from "@/src/types/dashboard";

const STATUS_STYLES: Record<DashboardStatus, string> = {
  onTrack: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
  atRisk: "bg-yellow-500/10 text-yellow-600 ring-yellow-500/20",
  offTrack: "bg-red-500/10 text-red-600 ring-red-500/20",
};

const STATUS_LABEL: Record<DashboardStatus, string> = {
  onTrack: "On Track",
  atRisk: "At Risk",
  offTrack: "Off Track",
};

export function StatusBadge({ status }: { status: DashboardStatus }) {
  return <span className={clsx("px-4 py-2 rounded-full text-sm font-semibold ring-1", STATUS_STYLES[status])}>{STATUS_LABEL[status]}</span>;
}
