import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../../../services/api/auth.service.ts";
import type { Therapist } from "../../../../domain/model/index.ts";
import type { StatusFilter } from "../types/admin-therapist.types.ts";

export const useTherapists = () => {
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [actionId, setActionId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<{ url: string; type: "image" | "pdf" } | null>(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [totalTherapists, setTotalTherapists] = useState(0);

    const getMediaUrl = (path: string | undefined) => {
        if (!path) return "";
        return path.startsWith("http") ? path : `${import.meta.env.VITE_API_BASE_URL}/${path}`;
    };

    const fetchTherapists = async (p: number, l: number, q: string) => {
        setLoading(true);
        try {
            const res = await adminService.getTherapists(p, l, q);
            setTherapists(res.data.data ?? []);
            if (res.data.meta) {
                setTotalPages(res.data.meta.totalPages);
                setPage(res.data.meta.page);
                setTotalTherapists(res.data.meta.total);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchTherapists(page, limit, debouncedSearch);
    }, [page, debouncedSearch]);

    const filtered = useMemo(() => {
        return therapists.filter((t) => {
            const matchesStatus = statusFilter === "all" || t.status === statusFilter;
            return matchesStatus;
        });
    }, [statusFilter, therapists]);

    const updateStatus = async (therapist: Therapist, status: "approved" | "rejected") => {
        try {
            setActionId(therapist.id + status);
            await adminService.updateTherapistStatus(therapist.id, status);
            setTherapists((prev) =>
                prev.map((t) => (t.id === therapist.id ? { ...t, status } : t))
            );
            toast.success(`Therapist ${status}`);
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

    return {
        therapists,
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
    };
};