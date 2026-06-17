import { Stethoscope } from "lucide-react";

export const SidebarBrand = () => (
  <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #4a6b52, #7aa07e)" }}>
        <Stethoscope size={15} className="text-white" />
      </div>
      <span className="font-display font-bold" style={{ color: "var(--fg-primary)" }}>reNove</span>
      <span className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded-full"
        style={{ color: "var(--accent-secondary)", background: "var(--accent-glow-secondary)", border: "1px solid rgba(74,107,82,0.3)" }}>
        Therapist
      </span>
    </div>
  </div>
);