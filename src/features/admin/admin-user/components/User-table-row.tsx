import { ShieldOff, ShieldCheck, Loader2 } from "lucide-react";
import type { UserTableRowProps } from "../types/admin-user.types";

export const UserTableRow = ({ user, actionId, toggleStatus }: UserTableRowProps) => {
    return (
        <tr className="hover:bg-brand-900/5 transition-colors">
            <td className="px-6 py-4">
                <div>
                    <p className="text-brand-900 text-sm font-medium">{user.name}</p>
                    <p className="text-brand-900/60 text-xs font-mono mt-0.5">{user.email}</p>
                </div>
            </td>
            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                            ? "bg-sage-500/10 text-sage-600 border border-sage-500/20"
                            : "bg-red-500/10 text-red-600 border border-red-500/20"
                    }`}
                >
                    {user.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className={`text-xs ${user.isVerified ? "text-sage-600" : "text-yellow-600"}`}>
                    {user.isVerified ? "Verified" : "Pending"}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-brand-900/40 text-xs font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={() => toggleStatus(user)}
                    disabled={actionId === user.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        user.status === "active"
                            ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20"
                            : "bg-sage-500/10 text-sage-600 hover:bg-sage-500/20 border border-sage-500/20"
                    } disabled:opacity-50`}
                >
                    {actionId === user.id ? (
                        <Loader2 size={11} className="animate-spin" />
                    ) : user.status === "active" ? (
                        <ShieldOff size={11} />
                    ) : (
                        <ShieldCheck size={11} />
                    )}
                    {user.status === "active" ? "Block" : "Unblock"}
                </button>
            </td>
        </tr>
    );
};