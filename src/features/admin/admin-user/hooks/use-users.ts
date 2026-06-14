import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../../../services/api/auth.service.ts";
import type { User } from "../../../../domain/model/index.ts";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [actionId, setActionId] = useState<string | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const fetchUsers = async (p: number, l: number, q: string) => {
        setLoading(true);
        try {
            const res = await adminService.getUsers(p, l, q);
            setUsers(res.data.data ?? []);
            if (res.data.meta) {
                setTotalPages(res.data.meta.totalPages);
                setPage(res.data.meta.page);
                setTotalUsers(res.data.meta.total);
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
        fetchUsers(page, limit, debouncedSearch);
    }, [page, debouncedSearch]);

    const toggleStatus = async (user: User) => {
        const newStatus = user.status === "active" ? "blocked" : "active";
        try {
            setActionId(user.id);
            await adminService.updateUserStatus(user.id, newStatus);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
            );
            toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
        } finally {
            setActionId(null);
        }
    };

    return {
        users,
        loading,
        search,
        setSearch,
        actionId,
        totalUsers,
        page,
        setPage,
        totalPages,
        toggleStatus,
    };
};