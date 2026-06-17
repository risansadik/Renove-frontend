import type { WalletPaginationProps } from "../types/user-wallet.types";

export const WalletPagination = ({ page, totalPages, setPage }: WalletPaginationProps) => {
  return (
    <div className="p-6 border-t border-white/5 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-slate-900 dark:text-white disabled:opacity-50 hover:bg-white/5 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-slate-900 dark:text-white disabled:opacity-50 hover:bg-white/5 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};