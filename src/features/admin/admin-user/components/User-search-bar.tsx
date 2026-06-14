import { Search } from "lucide-react";
import type { UserSearchBarProps } from "../types/admin-user.types";

export const UserSearchBar = ({ search, setSearch }: UserSearchBarProps) => {
    return (
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
    );
};