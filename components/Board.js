"use client";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { HelpCircle, Plus, Search } from "lucide-react";
import { COLUMNS, demoTasks, loadTasks, saveTasks } from "@/lib/store";
import Column from "./Column";
import TaskModal from "./TaskModal";
import ConfirmDialog from "./ConfirmDialog";
import Tour from "./Tour";

function nextId(tasks) {
  let max = 0;
  tasks.forEach((t) => {
    const n = parseInt(t.id.split("-")[1] || "0", 10);
    if (n > max) max = n;
  });
  return `TB-${max + 1}`;
}

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tourSignal, setTourSignal] = useState(0);
  const [dragOn, setDragOn] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  // load once
  useEffect(() => {
    const saved = loadTasks();
    setTasks(saved && saved.length ? saved : demoTasks());
    setReady(true);
  }, []);

  // persist
  useEffect(() => {
    if (ready) saveTasks(tasks);
  }, [tasks, ready]);

  // header "Create" button
  useEffect(() => {
    const open = () => {
      setEditing(null);
      setModalOpen(true);
    };
    window.addEventListener("open-create", open);
    return () => window.removeEventListener("open-create", open);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.desc?.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }, [tasks, query]);

  function byStatus(status) {
    return filtered
      .filter((t) => t.status === status)
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function onDragEnd(res) {
    setDragOn(false);
    const { source, destination, draggableId } = res;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    setTasks((prev) => {
      const moving = prev.find((t) => t.id === draggableId);
      if (!moving) return prev;
      const without = prev.filter((t) => t.id !== draggableId);

      // find global insert position for dest column
      const destGroup = without.filter((t) => t.status === destination.droppableId);
      let insertAt;
      if (destGroup.length === 0 || destination.index >= destGroup.length) {
        // append at end of dest group (or end of list)
        const lastIdx = without.map((t) => t.status).lastIndexOf(destination.droppableId);
        insertAt = lastIdx === -1 ? without.length : lastIdx + 1;
      } else {
        const target = destGroup[destination.index];
        insertAt = without.indexOf(target);
      }

      const updated = { ...moving, status: destination.droppableId };
      without.splice(insertAt, 0, updated);
      return without;
    });
  }

  function handleSave(data) {
    if (editing) {
      setTasks((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t)));
    } else {
      const { status: _ignore, ...rest } = data;
      const task = {
        id: nextId(tasks),
        status: "todo",
        createdAt: Date.now(),
        ...rest,
      };
      setTasks((prev) => [...prev, task]);
    }
    setModalOpen(false);
    setEditing(null);
  }

  function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setConfirmId(null);
  }

  if (!ready) return null;

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 pb-10">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        <div data-tour="search" className="flex items-center gap-2 rounded-md border border-board-border bg-white px-2.5 py-2 text-sm w-full dark:border-[#39424E] dark:bg-[#22272B] sm:w-64">
          <Search size={16} className="text-board-subtle dark:text-[#9FADBC] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search board"
            className="w-full bg-transparent text-board-navy outline-none placeholder:text-board-subtle dark:text-[#DEE4EA] dark:placeholder:text-[#9FADBC]"
          />
        </div>

        <span className="text-[13px] text-board-subtle dark:text-[#9FADBC] ml-1">
          {tasks.length} tasks
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setTourSignal((s) => s + 1)}
            title="Replay guide"
            className="rounded p-2 text-board-subtle hover:bg-white dark:text-[#9FADBC] dark:hover:bg-white/10"
          >
            <HelpCircle size={17} />
          </button>
          <button
            data-tour="add"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded bg-board-blue px-3.5 py-2 text-[13px] font-medium text-white hover:bg-board-bright"
          >
            <Plus size={15} /> Add task
          </button>
        </div>

        {/* progress strip */}
        {tasks.length > 0 && (
          <div className="flex w-full items-center gap-3 pt-1">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-board-hover dark:bg-white/10">
              <div
                className="h-full rounded-full bg-board-green transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-xs text-board-subtle dark:text-[#9FADBC]">
              {doneCount}/{tasks.length} done · {pct}%
            </span>
          </div>
        )}
      </div>

      {/* board */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-board-border bg-white px-6 py-16 text-center dark:border-[#39424E] dark:bg-[#22272B]">
          <div className="grid grid-cols-2 gap-1 opacity-40">
            <span className="h-8 w-8 rounded bg-board-blue" />
            <span className="h-8 w-8 rounded bg-board-green" />
            <span className="h-8 w-8 rounded bg-board-orange" />
            <span className="h-8 w-8 rounded bg-board-navy" />
          </div>
          <h2 className="text-lg font-semibold text-board-navy dark:text-[#DEE4EA]">Your board is empty</h2>
          <p className="max-w-sm text-sm text-board-subtle dark:text-[#9FADBC]">
            Create your first task and it will show up in To Do. Drag it across as you make progress.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-1 rounded bg-board-blue px-4 py-2 text-sm font-medium text-white hover:bg-board-bright"
          >
            Create task
          </button>
        </div>
      ) : (
        <DragDropContext onDragStart={() => setDragOn(true)} onDragEnd={onDragEnd}>
          <div className="flex flex-col divide-y divide-board-border rounded-xl border border-board-border bg-white dark:divide-[#2C333A] dark:border-[#2C333A] dark:bg-[#22272B] lg:grid lg:grid-cols-3 lg:items-start lg:gap-4 lg:divide-y-0 lg:border-0 lg:bg-transparent lg:p-0 lg:dark:bg-transparent">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                col={col}
                tasks={byStatus(col.id)}
                dragOn={dragOn}
                onAdd={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
                onEdit={(t) => {
                  setEditing(t);
                  setModalOpen(true);
                }}
                  onDelete={(id) => setConfirmId(id)}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      <TaskModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />

      <Tour startSignal={tourSignal} />

      <ConfirmDialog
        open={!!confirmId}
        title={`Delete ${confirmId || "task"}?`}
        message="This will permanently remove the task and its attachments. You can't undo this."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => handleDelete(confirmId)}
      />
    </div>
  );
}
