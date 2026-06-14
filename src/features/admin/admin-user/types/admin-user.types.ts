import type { User } from "../../../../domain/model";

export interface UserSearchBarProps {
    search: string;
    setSearch: (val: string) => void;
}

export interface UserTableRowProps {
    user: User;
    actionId: string | null;
    toggleStatus: (user: User) => Promise<void>;
}

export interface UserTableProps {
    loading: boolean;
    users: User[];
    search: string;
    actionId: string | null;
    toggleStatus: (user: User) => Promise<void>;
}
