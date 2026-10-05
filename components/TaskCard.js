import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Draggable } from "@hello-pangea/dnd";
import {
  Bookmark,
  Bug,
  CheckSquare,
  GripVertical,
  Paperclip,
  Pencil,
  Trash2,
} from "lucide-react";

function TypeIcon({ type }) {
  if (type === "Story")
    return <Bookmark size={14} className="text-board-green" fill="currentColor" />;
  if (type === "Bug") return <Bug size={14} className="text-red-500" />;
  return <CheckSquare size={14} className="text-board-bright" />;
}

function priorityColor(p) {
  if (p === "High") return "text-red-500";
  if (p === "Medium") return "text-orange-500";
  return "text-board-bright";
}

export default function TaskCard({ task, index, dimmed, onEdit, onDelete }) {
  const router = useRouter();
  const downAt = useRef(null);
  const files = task.attachments || [];

  function openTask(e) {
    // don't navigate after a drag — only on a real tap/click
    if (downAt.current) {
      const dx = Math.abs(e.clientX - downAt.current.x);
      const dy = Math.abs(e.clientY - downAt.current.y);
      if (dx + dy > 8) return;
    }
    router.push(`/task?id=${task.id}`);
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onPointerDown={(e) => (downAt.current = { x: e.clientX, y: e.clientY })}
          onClick={openTask}
          className={`card-enter board-card flex cursor-pointer gap-0.5 rounded-lg border bg-white p-2.5 transition-all duration-150 dark:bg-[#2C333A] dark:border-[#3A444E] ${
            snapshot.isDragging
              ? "rotate-[2deg] scale-[1.03] border-board-bright/50 shadow-pop ring-2 ring-board-bright/30"
              : dimmed
                ? "border-board-border opacity-50 saturate-50 shadow-none"
                : "border-board-border shadow-card hover:shadow-pop"
          }`}
        >
          {/* visible drag handle */}
          <span
            {...provided.dragHandleProps}
            title="Drag to move"
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 cursor-grab touch-none self-start rounded p-0.5 text-board-subtle/50 hover:bg-board-bg hover:text-board-subtle active:cursor-grabbing dark:text-[#9FADBC]/50 dark:hover:bg-white/10 dark:hover:text-[#9FADBC]"
          >
            <GripVertical size={16} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-board-subtle dark:text-[#9FADBC]">
              <TypeIcon type={task.type} />
              <span className="font-medium">{task.id}</span>
              <span className={`ml-auto font-bold ${priorityColor(task.priority)}`}>
                {task.priority === "High" ? "▲" : task.priority === "Medium" ? "●" : "▼"}
                <span className="ml-1 font-normal text-board-subtle dark:text-[#9FADBC]">{task.priority}</span>
              </span>
            </div>

            <h3 className="mt-1.5 text-[14px] font-medium leading-snug text-board-navy dark:text-[#DEE4EA]">
              {task.title}
            </h3>
            {task.desc && (
              <p className="mt-1 line-clamp-2 text-[13px] text-board-subtle dark:text-[#9FADBC]">{task.desc}</p>
            )}

            <div className="mt-2 flex items-center gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-board-navy/10 text-[11px] font-bold text-board-navy dark:bg-white/10 dark:text-[#DEE4EA]">
                {task.title[0]?.toUpperCase()}
              </span>
              {files.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-board-subtle dark:text-[#9FADBC]">
                  <Paperclip size={12} /> {files.length}
                </span>
              )}

              <div className="ml-auto flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="rounded p-1.5 hover:bg-board-bg text-board-subtle dark:text-[#9FADBC] dark:hover:bg-white/10"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="rounded p-1.5 hover:bg-red-50 text-board-subtle hover:text-red-600 dark:text-[#9FADBC] dark:hover:bg-white/10 dark:hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
