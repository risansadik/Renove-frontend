import { CheckCircle } from "lucide-react";

export const EmptyReviewState = () => {
  return (
    <div className="p-12 text-center rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 mb-4">
        <CheckCircle size={32} />
      </div>
      <h2 className="text-lg font-semibold" style={{ color: "var(--fg-primary)" }}>All caught up!</h2>
      <p className="text-sm mt-2" style={{ color: "var(--fg-muted)" }}>There are no pending profile updates to review right now.</p>
    </div>
  );
};