"use client";
import { useEffect, useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

const MAX_FILE_MB = 1.5;

function fmtSize(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function TaskModal({ open, initial, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Task");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo");
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setDesc(initial?.desc || "");
      setType(initial?.type || "Task");
      setPriority(initial?.priority || "Medium");
      setStatus(initial?.status || "todo");
      setFiles(initial?.attachments || []);
      setErr("");
    }
  }, [open, initial]);

  if (!open) return null;

  function pickFiles(e) {
    const chosen = Array.from(e.target.files || []);
    e.target.value = "";
    chosen.slice(0, 5 - files.length).forEach((f) => {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setErr(`"${f.name}" is over ${MAX_FILE_MB} MB — skipped`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          { name: f.name, size: f.size, kind: f.type || "file", data: reader.result },
        ]);
      };
      reader.readAsDataURL(f);
    });
  }

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setErr("Please give your task a title");
      return;
    }
    onSave({
      title: title.trim(),
      desc: desc.trim(),
      type,
      priority,
      status,
      attachments: files,
    });
  }

  const inputCls =
    "mt-1 w-full rounded-md border border-board-border bg-white px-3 py-2 text-sm text-board-navy outline-none focus:border-board-bright focus:ring-2 focus:ring-board-bright/20 dark:border-[#39424E] dark:bg-[#1D2125] dark:text-[#DEE4EA]";

  return (
    <div className="modal-bg fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-board-navy/50 p-0 sm:p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl bg-white shadow-pop dark:bg-[#22272B]"
      >
        <div className="flex items-center gap-2 border-b border-board-border px-4 py-3 dark:border-[#39424E]">
          <span className="text-sm font-semibold text-board-navy dark:text-[#DEE4EA]">
            {initial ? `Edit ${initial.id}` : "Create task"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded p-1.5 hover:bg-board-bg text-board-subtle dark:text-[#9FADBC] dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          <div>
            <label className="text-xs font-semibold text-board-subtle dark:text-[#9FADBC]">Title *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className={inputCls}
            />
            {err && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{err}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-board-subtle dark:text-[#9FADBC]">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Add some details…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-board-subtle dark:text-[#9FADBC]">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
                <option>Task</option>
                <option>Story</option>
                <option>Bug</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-board-subtle dark:text-[#9FADBC]">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {initial && (
            <div>
              <label className="text-xs font-semibold text-board-subtle dark:text-[#9FADBC]">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-board-subtle dark:text-[#9FADBC]">Attachments</label>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={pickFiles} />
            {files.length > 0 && (
              <div className="mt-1.5 flex flex-col gap-1.5">
                {files.map((f, i) => (
                  <div
                    key={`${f.name}-${i}`}
                    className="flex items-center gap-2 rounded-md border border-board-border px-2.5 py-1.5 text-[13px] dark:border-[#39424E]"
                  >
                    <Paperclip size={13} className="shrink-0 text-board-subtle dark:text-[#9FADBC]" />
                    <span className="truncate text-board-navy dark:text-[#DEE4EA]">{f.name}</span>
                    <span className="ml-auto shrink-0 text-xs text-board-subtle dark:text-[#9FADBC]">
                      {fmtSize(f.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, j) => j !== i))}
                      className="shrink-0 rounded p-1 text-board-subtle hover:text-red-600 dark:text-[#9FADBC]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-1.5 flex items-center gap-1.5 rounded-md border border-dashed border-board-border px-3 py-2 text-[13px] text-board-subtle hover:bg-board-bg dark:border-[#39424E] dark:text-[#9FADBC] dark:hover:bg-white/5"
              >
                <Paperclip size={14} /> Attach files or images
              </button>
            )}
            <p className="mt-1 text-[11px] text-board-subtle dark:text-[#9FADBC]">
              Images preview on the task page. Max {MAX_FILE_MB} MB each, saved in this browser.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-board-border bg-board-bg/50 px-4 py-3 dark:border-[#39424E] dark:bg-white/5">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-board-navy hover:bg-board-hover dark:text-[#DEE4EA] dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-board-blue px-4 py-2 text-sm font-medium text-white hover:bg-board-bright"
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
