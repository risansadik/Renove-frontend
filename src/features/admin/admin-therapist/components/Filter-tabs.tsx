import type { FilterTabsProps } from "../types/admin-therapist.types";

export const FilterTabs = ({ filterTabs, statusFilter, setStatusFilter, counts }: FilterTabsProps) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {filterTabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
                        statusFilter === tab
                            ? "bg-brand-500/15 text-brand-600 border-brand-500/25"
                            : "text-brand-900/60 border-brand-900/10 hover:border-brand-900/20 hover:text-brand-900/80"
                    }`}
                >
                    {tab} <span className="ml-1 opacity-60">({counts[tab]})</span>
                </button>
            ))}
        </div>
    );
};