import type { Therapist } from "../../../../domain/model";

export type StatusFilter = "all" | "pending" | "approved" | "rejected";

export interface FilterTabsProps {
    filterTabs: StatusFilter[];
    statusFilter: StatusFilter;
    setStatusFilter: (tab: StatusFilter) => void;
    counts: Record<StatusFilter, number>;
}

export interface SearchBarProps {
    search: string;
    setSearch: (val: string) => void;
}

export interface DocumentPreviewModalProps {
    previewUrl: { url: string; type: "image" | "pdf" };
    onClose: () => void;
}

export interface TherapistCardProps {
    therapist: Therapist;
    statusColors: Record<Therapist["status"], string>;
    actionId: string | null;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    setPreviewUrl: (preview: { url: string; type: "image" | "pdf" } | null) => void;
    updateStatus: (therapist: Therapist, status: "approved" | "rejected") => Promise<void>;
    getMediaUrl: (path: string | undefined) => string;
}

export const statusColors: Record<Therapist["status"], string> = {
    pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    approved: "bg-green-400/10 text-green-400 border-green-400/20",
    rejected: "bg-red-400/10 text-red-400 border-red-400/20",
    review_required: "bg-blue-400/10 text-blue-400 border-blue-400/20",
};

