import type { TherapistProfileProps } from "../types/therapist-layout.types";

export const SidebarProfileCard = ({ name, specialization }: TherapistProfileProps) => (
  <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ background: "linear-gradient(135deg, #4a6b52, #7aa07e)" }}>
        {name?.charAt(0).toUpperCase() ?? "T"}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-primary)" }}>{name ?? "Therapist"}</p>
        <p className="text-xs truncate" style={{ color: "var(--fg-muted)" }}>{specialization?.[0] ?? "Specialist"}</p>
      </div>
    </div>
  </div>
);