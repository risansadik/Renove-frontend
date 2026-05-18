import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/api/auth.service.js";
import type { Therapist } from "../../domain/model/index.js";
import { Search, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, FileText, ImageIcon, X } from "lucide-react";
import { handleError } from "../../core/utils/error-handler.js";

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
    const [previewUrl, setPreviewUrl] = useState<{ url: string, type: 'image' | 'pdf' } | null>(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalTherapists, setTotalTherapists] = useState(0);

    const fetchTherapists = async (p: number, l: number) => {
        setLoading(true);
        try {
            const res = await adminService.getTherapists(p, l);
            setTherapists(res.data.data ?? []);
            if (res.data.meta) {
                setTotalPages(res.data.meta.totalPages);
                setPage(res.data.meta.page);
                setTotalTherapists(res.data.meta.total);
            }
        } catch (err) {
            handleError(err, "Failed to load therapists");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTherapists(page, limit);
    }, [page, limit]);

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
            handleError(err, "Action failed");
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
                <p className="text-brand-900/60 text-sm">{totalTherapists} total applications</p>
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
                                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                                    {therapist.profileImage ? (
                                        <img 
                                            src={`${import.meta.env.VITE_API_BASE_URL}/${therapist.profileImage}`} 
                                            className="w-full h-full object-cover" 
                                            alt={therapist.name} 
                                        />
                                    ) : (
                                        <span className="text-brand-600 font-display font-bold text-sm">
                                            {therapist.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
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
                                            <p className="text-brand-900/40 text-xs uppercase tracking-wider mb-2">Certification Labels</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {therapist.certifications.map((c) => (
                                                    <span key={c} className="px-2.5 py-1 bg-brand-900/5 border border-brand-900/10 rounded-full text-brand-900/60 text-xs">
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {(therapist as any).certificationFiles?.length > 0 && (
                                        <div className="sm:col-span-2 mt-4 p-4 bg-brand-500/5 rounded-2xl border border-brand-500/10">
                                            <p className="text-brand-900/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Review Certifications</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {(therapist as any).certificationFiles?.map((file: string, idx: number) => {
                                                    const isPdf = file.toLowerCase().endsWith('.pdf');
                                                    return (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => setPreviewUrl({ 
                                                                url: `${import.meta.env.VITE_API_BASE_URL}/${file}`, 
                                                                type: isPdf ? 'pdf' : 'image' 
                                                            })}
                                                            className="group relative flex flex-col items-center justify-center gap-3 aspect-square rounded-xl bg-white border border-brand-500/10 hover:border-brand-500/30 transition-all shadow-sm p-4 text-center overflow-hidden"
                                                        >
                                                            {isPdf ? (
                                                                <FileText size={24} className="text-red-500/60 group-hover:scale-110 transition-transform" />
                                                            ) : (
                                                                <ImageIcon size={24} className="text-brand-500/60 group-hover:scale-110 transition-transform" />
                                                            )}
                                                            <span className="text-[10px] text-brand-900/40 font-medium truncate w-full">
                                                                {isPdf ? 'PDF Cert' : 'Image Cert'}
                                                            </span>
                                                            <div className="absolute inset-0 bg-brand-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </button>
                                                    );
                                                })}
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

            {/* Document Preview Modal */}
            {previewUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
                    <div 
                        className="absolute inset-0 bg-brand-900/90 backdrop-blur-sm" 
                        onClick={() => setPreviewUrl(null)} 
                    />
                    
                    <div className="relative w-full max-w-4xl max-h-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-up flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-500/10 bg-white shrink-0">
                            <h3 className="font-display font-bold text-brand-900">Document Preview</h3>
                            <button 
                                onClick={() => setPreviewUrl(null)}
                                className="w-8 h-8 rounded-full bg-brand-500/5 hover:bg-brand-500/10 flex items-center justify-center text-brand-900/40 hover:text-brand-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-auto bg-brand-900/5 p-4 flex items-center justify-center min-h-0">
                            {previewUrl.type === 'image' ? (
                                <img 
                                    src={previewUrl.url} 
                                    alt="Preview" 
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                />
                            ) : (
                                <iframe 
                                    src={previewUrl.url} 
                                    className="w-full h-full min-h-[70vh] rounded-lg bg-white"
                                    title="PDF Preview"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
