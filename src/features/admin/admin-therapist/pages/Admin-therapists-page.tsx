import { Loader2 } from "lucide-react";
import { useTherapists } from "../hooks/use-therapists";
import { FilterTabs } from "../components/Filter-tabs";
import { SearchBar } from "../components/Search-bar";
import { TherapistCard } from "../components/Therapist-card";
import { DocumentPreviewModal } from "../components/Document-preview-modal";
import { statusColors } from "../types/admin-therapist.types";


export const AdminTherapistsPage = () => {
    const {
        loading,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        actionId,
        expandedId,
        setExpandedId,
        previewUrl,
        setPreviewUrl,
        page,
        setPage,
        totalPages,
        totalTherapists,
        filtered,
        filterTabs,
        counts,
        updateStatus,
        getMediaUrl,
    } = useTherapists();

    return (
        <div>
            <div className="mb-6 stagger-1">
                <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">Therapist management</h1>
                <p className="text-brand-900/60 text-sm">{totalTherapists} total applications</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 stagger-2">
                <FilterTabs
                    filterTabs={filterTabs}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    counts={counts}
                />
                <SearchBar search={search} setSearch={setSearch} />
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
                        <TherapistCard
                            key={therapist.id}
                            therapist={therapist}
                            statusColors={statusColors}
                            actionId={actionId}
                            expandedId={expandedId}
                            setExpandedId={setExpandedId}
                            setPreviewUrl={setPreviewUrl}
                            updateStatus={updateStatus}
                            getMediaUrl={getMediaUrl}
                        />
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

            {previewUrl && (
                <DocumentPreviewModal
                    previewUrl={previewUrl}
                    onClose={() => setPreviewUrl(null)}
                />
            )}
        </div>
    );
};