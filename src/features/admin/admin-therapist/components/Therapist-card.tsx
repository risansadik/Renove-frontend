import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, FileText, ImageIcon } from "lucide-react";
import type { TherapistCardProps } from "../types/admin-therapist.types";

export const TherapistCard = ({
    therapist,
    statusColors,
    actionId,
    expandedId,
    setExpandedId,
    setPreviewUrl,
    updateStatus,
    getMediaUrl,
}: TherapistCardProps) => {
    return (
        <div className="bg-surface-50 border border-brand-900/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {therapist.profileImage ? (
                        <img
                            src={getMediaUrl(therapist.profileImage)}
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
                        { label: "Gender", value: therapist.gender },
                        { label: "Qualification", value: therapist.qualification },
                        { label: "Experience", value: `${therapist.experience} years` },
                        { label: "Consultation fee", value: `USD ${therapist.consultationFee}` },
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
                                <span key={s} className="px-2.5 py-1 bg-brand-500/10 border border-brand-500/15 rounded-full text-brand-600 text-xs">
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

                    {therapist.certificationFiles && therapist.certificationFiles.length > 0 && (
                        <div className="sm:col-span-2 mt-4 p-4 bg-brand-500/5 rounded-2xl border border-brand-500/10">
                            <p className="text-brand-900/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Review Certifications</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {therapist.certificationFiles?.map((file: string, idx: number) => {
                                    const isPdf = file.toLowerCase().endsWith(".pdf");
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setPreviewUrl({
                                                url: getMediaUrl(file),
                                                type: isPdf ? "pdf" : "image",
                                            })}
                                            className="group relative flex flex-col items-center justify-center gap-3 aspect-square rounded-xl bg-white border border-brand-500/10 hover:border-brand-500/30 transition-all shadow-sm p-4 text-center overflow-hidden"
                                        >
                                            {isPdf ? (
                                                <FileText size={24} className="text-red-500/60 group-hover:scale-110 transition-transform" />
                                            ) : (
                                                <ImageIcon size={24} className="text-brand-500/60 group-hover:scale-110 transition-transform" />
                                            )}
                                            <span className="text-[10px] text-brand-900/40 font-medium truncate w-full">
                                                {isPdf ? "PDF Cert" : "Image Cert"}
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
    );
};