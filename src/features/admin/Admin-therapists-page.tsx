import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/api/auth.service.js";
import type { Therapist } from "../../domain/model/index.js";
import { Search, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const statusColors: Record<Therapist["status"], string> = {
    pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    approved: "bg-green-400/10 text-green-400 border-green-400/20",
    rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

export const AdminTherapistsPage = () => {
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [actionId, setActionId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        adminService
            .getTherapists()
            .then((res) => {
                setTherapists(res.data.data ?? []);
            })
            .catch((err) => {
                toast.error(err instanceof Error ? err.message : "Failed to load therapists");
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return therapists.filter((t) => {
            const matchesSearch = t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
            const matchesStatus = statusFilter === "all" || t.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter, therapists]);

    const updateStatus = async (therapist: Therapist, status: "approved" | "rejected") => {
        try {
            setActionId(therapist.id + status);
            await adminService.updateTherapistStatus(therapist.id, status);
            setTherapists((prev) =>
                prev.map((t) => (t.id === therapist.id ? { ...t, status } : t))
            );
            toast.success(`Therapist ${status}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Action failed");
        } finally {
            setActionId(null);
        }
    };

    const filterTabs: StatusFilter[] = ["all", "pending", "approved", "rejected"];
    const counts = {
        all: therapists.length,
        pending: therapists.filter((t) => t.status === "pending").length,
        approved: therapists.filter((t) => t.status === "approved").length,
        rejected: therapists.filter((t) => t.status === "rejected").length,
    };

    return (
        <div>
            <div className="mb-6 stagger-1">
                <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">Therapist management</h1>
                <p className="text-brand-900/60 text-sm">{therapists.length} total applications</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 stagger-2">
                <div className="flex gap-2 flex-wrap">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${statusFilter === tab
                                    ? "bg-brand-500/15 text-brand-600 border-brand-500/25"
                                    : "text-brand-900/60 border-brand-900/10 hover:border-brand-900/20 hover:text-brand-900/80"
                                }`}
                        >
                            {tab} <span className="ml-1 opacity-60">({counts[tab]})</span>
                        </button>
                    ))}
                </div>

                <div className="sm:ml-auto relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/40" />
                    <input
                        type="text"
                        placeholder="Search therapists..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-9 w-full sm:w-64 text-sm py-2"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 stagger-3">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-brand-600" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-brand-900/40 text-sm bg-surface-50 border border-brand-900/10 rounded-2xl">
                        No therapists found.
                    </div>
                ) : (
                    filtered.map((therapist) => (
                        <div
                            key={therapist.id}
                            className="bg-surface-50 border border-brand-900/10 rounded-2xl overflow-hidden"
                        >
                            <div className="flex items-center gap-4 px-6 py-4">
                                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-brand-600 font-display font-bold text-sm">
                                        {therapist.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-brand-900 text-sm font-medium truncate">{therapist.name}</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${statusColors[therapist.status]}`}>
                                            {therapist.status}
                                        </span>
                                    </div>
                                    <p className="text-brand-900/60 text-xs font-mono mt-0.5 truncate">{therapist.email}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {therapist.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(therapist, "approved")}
                                                disabled={!!actionId}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sage-500/10 text-sage-600 hover:bg-sage-500/20 border border-sage-500/20 transition-all disabled:opacity-50"
                                            >
                                                {actionId === therapist.id + "approved" ? (
                                                    <Loader2 size={11} className="animate-spin" />
                                                ) : (
                                                    <CheckCircle2 size={11} />
                                                )}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(therapist, "rejected")}
                                                disabled={!!actionId}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                                            >
                                                {actionId === therapist.id + "rejected" ? (
                                                    <Loader2 size={11} className="animate-spin" />
                                                ) : (
                                                    <XCircle size={11} />
                                                )}
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        aria-label={expandedId === therapist.id ? "Collapse therapist details" : "Expand therapist details"}
                                        onClick={() => setExpandedId(expandedId === therapist.id ? null : therapist.id)}
                                        className="text-brand-900/40 hover:text-brand-900/80 transition-colors p-1"
                                    >
                                        {expandedId === therapist.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {expandedId === therapist.id && (
                                <div className="border-t border-brand-900/10 px-6 py-5 grid sm:grid-cols-2 gap-x-8 gap-y-4 animate-fade-in">
                                    {[
                                        { label: "Phone", value: therapist.phone },
                                        { label: "Gender", value: therapist.gender },
                                        { label: "Qualification", value: therapist.qualification },
                                        { label: "Experience", value: `${therapist.experience} years` },
                                        { label: "Consultation fee", value: `INR ${therapist.consultationFee}` },
                                        { label: "Joined", value: new Date(therapist.createdAt).toLocaleDateString() },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <p className="text-brand-900/40 text-xs uppercase tracking-wider mb-1">{label}</p>
                                            <p className="text-brand-900/80 text-sm">{value}</p>
                                        </div>
                                    ))}

                                    <div className="sm:col-span-2">
                                        <p className="text-brand-900/40 text-xs uppercase tracking-wider mb-1">Specializations</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {therapist.specialization.map((s) => (
                                                <span
                                                    key={s}
                                                    className="px-2.5 py-1 bg-brand-500/10 border border-brand-500/15 rounded-full text-brand-600 text-xs"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {therapist.bio && (
                                        <div className="sm:col-span-2">
                                            <p className="text-brand-900/40 text-xs uppercase tracking-wider mb-1">Bio</p>
                                            <p className="text-brand-900/60 text-sm leading-relaxed">{therapist.bio}</p>
                                        </div>
                                    )}

                                    {therapist.certifications && therapist.certifications.length > 0 && (
                                        <div className="sm:col-span-2">
                                            <p className="text-brand-900/40 text-xs uppercase tracking-wider mb-1">Certifications</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {therapist.certifications.map((c) => (
                                                    <span key={c} className="px-2.5 py-1 bg-brand-900/5 border border-brand-900/10 rounded-full text-brand-900/60 text-xs">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {therapist.status !== "pending" && (
                                        <div className="sm:col-span-2 flex gap-2 pt-2">
                                            {therapist.status === "approved" ? (
                                                <button
                                                    onClick={() => updateStatus(therapist, "rejected")}
                                                    disabled={!!actionId}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                                                >
                                                    <XCircle size={11} /> Revoke approval
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateStatus(therapist, "approved")}
                                                    disabled={!!actionId}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sage-500/10 text-sage-600 hover:bg-sage-500/20 border border-sage-500/20 transition-all disabled:opacity-50"
                                                >
                                                    <CheckCircle2 size={11} /> Approve
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
