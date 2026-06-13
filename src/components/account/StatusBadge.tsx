import { clsx } from "clsx";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "border-muted/40 text-muted",
  confirmed: "border-gold/40 text-gold",
  processing: "border-gold/40 text-gold",
  shipped: "border-platinum/40 text-platinum",
  delivered: "border-success/40 text-success",
  cancelled: "border-danger/40 text-danger",
  returned: "border-danger/40 text-danger",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={clsx(
        "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
