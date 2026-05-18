import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/api/auth.service.js";
import type { User } from "../../domain/model/index.js";
import { Search, ShieldOff, ShieldCheck, Loader2 } from "lucide-react";
import { handleError } from "../../core/utils/error-handler.js";

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionId, setActionId] = useState<string | null>(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchUsers = async (p: number, l: number) => {
        setLoading(true);
        try {
            const res = await adminService.getUsers(p, l);
            setUsers(res.data.data ?? []);
            if (res.data.meta) {
                setTotalPages(res.data.meta.totalPages);
                setPage(res.data.meta.page);
            }
        } catch (err) {
            handleError(err, "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page, limit);
    }, [page, limit]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [search, users]);

    const toggleStatus = async (user: User) => {
        const newStatus = user.status === "active" ? "blocked" : "active";
        try {
            setActionId(user.id);
            await adminService.updateUserStatus(user.id, newStatus);
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)));
            toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
        } catch (err) {
            handleError(err, "Action failed");
        } finally {
            setActionId(null);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 stagger-1">
                <div>
                    <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">User management</h1>
                    <p className="text-brand-900/60 text-sm">{users.length} total users</p>
                </div>

                <div className="sm:ml-auto relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/40" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-9 w-full sm:w-64 text-sm py-2"
                    />
                </div>
            </div>

            <div className="bg-surface-50 border border-brand-900/10 rounded-2xl overflow-hidden stagger-2">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-brand-600" />
                    </div>
                ) : filtered.length === 0 ? (
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
                                {filtered.map((user) => (
                                    <tr key={user.id} className="hover:bg-brand-900/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-brand-900 text-sm font-medium">{user.name}</p>
                                                <p className="text-brand-900/60 text-xs font-mono mt-0.5">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "active"
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
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.status === "active"
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between stagger-3">
                    <p className="text-sm text-brand-900/60">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg border border-brand-900/10 text-sm font-medium text-brand-900 disabled:opacity-50 hover:bg-brand-900/5 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-lg border border-brand-900/10 text-sm font-medium text-brand-900 disabled:opacity-50 hover:bg-brand-900/5 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
