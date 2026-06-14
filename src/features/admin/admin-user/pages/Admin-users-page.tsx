import { useUsers } from "../hooks/use-users";
import { UserSearchBar } from "../components/User-search-bar";
import { UserTable } from "../components/User-table";

export const AdminUsersPage = () => {
    const {
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
    } = useUsers();

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 stagger-1">
                <div>
                    <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">User management</h1>
                    <p className="text-brand-900/60 text-sm">{totalUsers} total users</p>
                </div>
                <UserSearchBar search={search} setSearch={setSearch} />
            </div>

            <UserTable
                loading={loading}
                users={users}
                search={search}
                actionId={actionId}
                toggleStatus={toggleStatus}
            />

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