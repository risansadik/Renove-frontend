import { useEffect, useState } from "react";
import { adminService } from "../../services/api/auth.service.js";
import type { User, Therapist } from "../../domain/model/index.js";
import { Users, Stethoscope, Clock, CheckCircle2, TrendingUp } from "lucide-react";

export const AdminOverviewPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([adminService.getUsers(), adminService.getTherapists()])
            .then(([uRes, tRes]) => {
                setUsers(uRes.data.data ?? []);
                setTherapists(tRes.data.data ?? []);
            })
            .finally(() => setLoading(false));
    }, []);

    const pending = therapists.filter((t) => t.status === "pending").length;
    const approved = therapists.filter((t) => t.status === "approved").length;
    const blocked = users.filter((u) => u.status === "blocked").length;

    const stats = [
        { label: "Total users", value: users.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Total therapists", value: therapists.length, icon: Stethoscope, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Pending approval", value: pending, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { label: "Active therapists", value: approved, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display text-2xl font-bold text-white mb-1">Overview</h1>
                <p className="text-white/35 text-sm">Platform health at a glance.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-surface-50 rounded-2xl border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className="bg-surface-50 border border-white/5 rounded-2xl p-5">
                                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                                    <Icon size={18} className={color} />
                                </div>
                                <p className="text-2xl font-display font-bold text-white">{value}</p>
                                <p className="text-white/40 text-xs mt-1">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick insights */}
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div className="bg-surface-50 border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={16} className="text-brand-400" />
                                <h2 className="font-display font-semibold text-white text-sm">User health</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Active</span>
                                    <span className="text-green-400 font-mono">{users.length - blocked}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Blocked</span>
                                    <span className="text-red-400 font-mono">{blocked}</span>
                                </div>
                                {users.length > 0 && (
                                    <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-400/60 rounded-full"
                                            style={{ width: `${((users.length - blocked) / users.length) * 100}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-surface-50 border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Stethoscope size={16} className="text-brand-400" />
                                <h2 className="font-display font-semibold text-white text-sm">Therapist pipeline</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                {[
                                    { label: "Pending", count: pending, color: "text-yellow-400" },
                                    { label: "Approved", count: approved, color: "text-green-400" },
                                    { label: "Rejected", count: therapists.filter((t) => t.status === "rejected").length, color: "text-red-400" },
                                ].map(({ label, count, color }) => (
                                    <div key={label} className="flex justify-between text-sm">
                                        <span className="text-white/40">{label}</span>
                                        <span className={`font-mono ${color}`}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};