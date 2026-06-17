import type { IdentityBlockProps } from "../types/user-layout.types";

export const IdentityBlock = ({ user }: IdentityBlockProps) => {
  return (
    <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
          style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}>
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-primary)" }}>
            {user?.name ?? "User"}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--fg-muted)" }}>Recovery Journey</p>
        </div>
      </div>
    </div>
  );
};