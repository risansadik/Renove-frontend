import { Loader2 } from "lucide-react";
import type { UserTableProps } from "../types/admin-user.types.ts";
import { UserTableRow } from "./User-table-row.tsx";

export const UserTable = ({ loading, users, search, actionId, toggleStatus }: UserTableProps) => {
    return (
        <div className="bg-surface-50 border border-brand-900/10 rounded-2xl overflow-hidden stagger-2">
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={24} className="animate-spin text-brand-600" />
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-16 text-brand-900/40 text-sm">
                    {search ? "No users match your search." : "No users found."}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-brand-900/10">
                                <th className="text-left px-6 py-4 text-xs text-brand-900/60 font-medium uppercase tracking-wider">User</th>
                                <th className="text-left px-6 py-4 text-xs text-brand-900/60 font-medium uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs text-brand-900/60 font-medium uppercase tracking-wider">Verified</th>
                                <th className="text-left px-6 py-4 text-xs text-brand-900/60 font-medium uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-900/10">
                            {users.map((user) => (
                                <UserTableRow
                                    key={user.id}
                                    user={user}
                                    actionId={actionId}
                                    toggleStatus={toggleStatus}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};