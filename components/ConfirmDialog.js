"use client";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="modal-bg fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-board-navy/50 p-0 sm:p-4">
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-xl bg-white p-5 shadow-pop card-enter dark:bg-[#22272B] dark:border dark:border-[#39424E]">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
            <AlertTriangle size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-board-navy dark:text-white">{title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-board-subtle dark:text-[#9FADBC]">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded px-4 py-2 text-sm text-board-navy hover:bg-board-bg dark:text-[#DEE4EA] dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
