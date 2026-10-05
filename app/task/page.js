"use client";
import { Component, Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Bug,
  CheckSquare,
  Download,
  FileText,
  Paperclip,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { COLUMNS, loadTasks, saveTasks } from "@/lib/store";
import TaskModal from "@/components/TaskModal";
import ConfirmDialog from "@/components/ConfirmDialog";

const MAX_FILE_MB = 1.5;

function fmtSize(b) {
  if (!b && b !== 0) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function TypeIcon({ type }) {
  if (type === "Story")
    return <Bookmark size={15} className="text-board-green" fill="currentColor" />;
  if (type === "Bug") return <Bug size={15} className="text-red-500" />;
  return <CheckSquare size={15} className="text-board-bright" />;
}

function Viewer() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const [tasks, setTasks] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    setTasks(loadTasks() || []);
  }, []);

  useEffect(() => {
    if (tasks) {
      try {
        saveTasks(tasks);
      } catch {
        setMsg("Browser storage is full — remove an attachment to keep saving.");
      }
    }
  }, [tasks]);

  if (!tasks) return null;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-lg font-semibold text-board-navy dark:text-[#DEE4EA]">Task not found</h2>
        <p className="mt-1 text-sm text-board-subtle dark:text-[#9FADBC]">
          It may have been deleted on another tab.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 rounded bg-board-blue px-4 py-2 text-sm font-medium text-white hover:bg-board-bright"
        >
          <ArrowLeft size={15} /> Back to board
        </Link>
      </div>
    );
  }

  const files = task.attachments || [];

  function update(patch) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));
  }

  function addFiles(e) {
    const chosen = Array.from(e.target.files || []);
    e.target.value = "";
    chosen.slice(0, 5 - files.length).forEach((f) => {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setMsg(`"${f.name}" is over ${MAX_FILE_MB} MB — skipped`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        update({ attachments: [...(task.attachments || []), { name: f.name, size: f.size, kind: f.type || "file", data: reader.result }] });
      reader.readAsDataURL(f);
    });
  }

  function removeFile(i) {
    update({ attachments: files.filter((_, j) => j !== i) });
  }

  function handleDelete() {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setConfirmDel(false);
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 pb-10">
      {/* top bar */}
      <div className="flex items-center gap-2 py-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded border border-board-border bg-white px-3 py-2 text-[13px] text-board-navy hover:bg-board-bg dark:border-[#39424E] dark:bg-[#22272B] dark:text-[#DEE4EA] dark:hover:bg-white/5"
        >
          <ArrowLeft size={15} /> Board
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded border border-board-border bg-white px-3 py-2 text-[13px] text-board-navy hover:bg-board-bg dark:border-[#39424E] dark:bg-[#22272B] dark:text-[#DEE4EA] dark:hover:bg-white/5"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => setConfirmDel(true)}
            className="flex items-center gap-1.5 rounded border border-board-border bg-white px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 dark:border-[#39424E] dark:bg-[#22272B] dark:text-red-400 dark:hover:bg-white/5"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {msg && (
        <p className="mb-3 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-[13px] text-orange-800 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200">
          {msg}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* main */}
        <div className="rounded-xl border border-board-border bg-white p-4 sm:p-6 dark:border-[#2C333A] dark:bg-[#22272B]">
          <p className="text-xs text-board-subtle dark:text-[#9FADBC]">Board / {task.id}</p>
          <h1 className="mt-1 text-xl font-semibold text-board-navy dark:text-[#DEE4EA] sm:text-2xl">
            {task.title}
          </h1>

          <div className="mt-4">
            <h2 className="text-[13px] font-bold text-board-navy dark:text-[#DEE4EA]">Description</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-board-subtle dark:text-[#9FADBC]">
              {task.desc || "No description yet — hit Edit to add one."}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-bold text-board-navy dark:text-[#DEE4EA]">
                Attachments ({files.length})
              </h2>
              {files.length < 5 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="ml-auto flex items-center gap-1.5 rounded border border-dashed border-board-border px-3 py-1.5 text-[13px] text-board-subtle hover:bg-board-bg dark:border-[#39424E] dark:text-[#9FADBC] dark:hover:bg-white/5"
                >
                  <Paperclip size={13} /> Attach
                </button>
              )}
              <input ref={fileRef} type="file" multiple className="hidden" onChange={addFiles} />
            </div>

            {files.length === 0 ? (
              <div className="mt-2 rounded-lg border border-dashed border-board-border px-4 py-8 text-center text-[13px] text-board-subtle dark:border-[#39424E] dark:text-[#9FADBC]">
                No files yet. Screenshots and docs live here.
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {files.map((f, i) => (
                  <div
                    key={`${f.name}-${i}`}
                    className="group relative overflow-hidden rounded-lg border border-board-border dark:border-[#39424E]"
                  >
                    {f.kind.startsWith("image/") ? (
                      <img src={f.data} alt={f.name} className="h-28 w-full object-cover" />
                    ) : (
                      <div className="flex h-28 flex-col items-center justify-center gap-1 bg-board-bg p-2 text-center dark:bg-white/5">
                        <FileText size={22} className="text-board-subtle dark:text-[#9FADBC]" />
                        <span className="line-clamp-2 text-[11px] text-board-subtle dark:text-[#9FADBC]">
                          {f.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-white px-2 py-1.5 dark:bg-[#2C333A]">
                      <span className="truncate text-[11px] text-board-navy dark:text-[#DEE4EA]">
                        {f.name} · {fmtSize(f.size)}
                      </span>
                      <a
                        href={f.data}
                        download={f.name}
                        title="Download"
                        className="ml-auto shrink-0 rounded p-1 text-board-subtle hover:bg-board-bg dark:text-[#9FADBC] dark:hover:bg-white/10"
                      >
                        <Download size={13} />
                      </a>
                      <button
                        onClick={() => removeFile(i)}
                        title="Remove"
                        className="shrink-0 rounded p-1 text-board-subtle hover:text-red-600 dark:text-[#9FADBC]"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* sidebar */}
        <aside className="h-fit rounded-xl border border-board-border bg-white p-4 dark:border-[#2C333A] dark:bg-[#22272B]">
          <h2 className="text-[13px] font-bold text-board-navy dark:text-[#DEE4EA]">Details</h2>
          <dl className="mt-3 space-y-3 text-[13px]">
            <div>
              <dt className="text-xs text-board-subtle dark:text-[#9FADBC]">Status</dt>
              <dd className="mt-1">
                <select
                  value={task.status}
                  onChange={(e) => update({ status: e.target.value })}
                  className="w-full rounded-md border border-board-border bg-white px-2 py-1.5 text-board-navy dark:border-[#39424E] dark:bg-[#1D2125] dark:text-[#DEE4EA]"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-board-subtle dark:text-[#9FADBC]">Type</dt>
              <dd className="flex items-center gap-1.5 font-medium text-board-navy dark:text-[#DEE4EA]">
                <TypeIcon type={task.type} /> {task.type}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-board-subtle dark:text-[#9FADBC]">Key</dt>
              <dd className="font-medium text-board-navy dark:text-[#DEE4EA]">{task.id}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-xs text-board-subtle dark:text-[#9FADBC]">Created</dt>
              <dd className="font-medium text-board-navy dark:text-[#DEE4EA]">
                {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "—"}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <TaskModal
        open={modalOpen}
        initial={task}
        onClose={() => setModalOpen(false)}
        onSave={(data) => {
          update(data);
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmDel}
        title={`Delete ${task.id}?`}
        message="This will permanently remove the task and its attachments. You can't undo this."
        onCancel={() => setConfirmDel(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

class TaskError extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-lg font-semibold text-board-navy dark:text-[#DEE4EA]">
            Couldn't open this task
          </h2>
          <p className="mt-1 text-sm text-board-subtle dark:text-[#9FADBC]">
            Its saved data looks broken. Go back to the board — your other tasks are safe.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-1.5 rounded bg-board-blue px-4 py-2 text-sm font-medium text-white hover:bg-board-bright"
          >
            <ArrowLeft size={15} /> Back to board
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TaskPage() {
  return (
    <Suspense>
      <TaskError>
        <Viewer />
      </TaskError>
    </Suspense>
  );
}
