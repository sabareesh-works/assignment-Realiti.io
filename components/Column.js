import { Droppable } from "@hello-pangea/dnd";
import { CircleDashed, Plus } from "lucide-react";
import TaskCard from "./TaskCard";

const dot = {
  todo: "bg-board-subtle",
  progress: "bg-board-bright",
  done: "bg-board-green",
};

const pill = {
  todo: "bg-board-hover/70 text-board-subtle dark:bg-white/10 dark:text-[#9FADBC]",
  progress: "bg-board-blueBg text-board-blue dark:bg-[#1C2B41] dark:text-[#579DFF]",
  done: "bg-board-greenBg text-board-green dark:bg-[#1C3329] dark:text-[#4BCE97]",
};

export default function Column({ col, tasks, dragOn, onAdd, onEdit, onDelete }) {
  return (
    <section className="flex flex-col bg-white px-1 py-3 dark:bg-[#22272B] lg:rounded-xl lg:border lg:border-board-border lg:bg-board-bg lg:p-3 lg:shadow-card lg:dark:border-[#2C333A] lg:dark:bg-[#22272B]">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${pill[col.id]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot[col.id]}`} />
          {col.title}
        </span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-board-subtle dark:bg-white/10 dark:text-[#9FADBC]">
          {tasks.length}
        </span>
        <button
          onClick={onAdd}
          className="ml-auto rounded p-1 hover:bg-board-hover text-board-subtle dark:text-[#9FADBC] dark:hover:bg-white/10"
          title="Add task"
        >
          <Plus size={16} />
        </button>
      </div>

      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-1 flex-col gap-2 rounded-lg p-1 transition-colors min-h-[120px] ${
              snapshot.isDraggingOver
                ? "bg-board-blueBg/70 ring-2 ring-inset ring-board-bright/40 dark:bg-[#1C2B41]/60"
                : ""
            }`}
          >
            {tasks.length === 0 ? (
              <div
                className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors ${
                  dragOn
                    ? "border-board-bright/60 bg-board-blueBg/50 dark:bg-[#1C2B41]/50"
                    : "border-board-border bg-white/60 dark:border-[#39424E] dark:bg-white/5"
                }`}
              >
                <CircleDashed
                  size={22}
                  className={dragOn ? "text-board-bright" : "text-board-subtle/60 dark:text-[#9FADBC]/60"}
                />
                <p className={`text-[13px] ${dragOn ? "font-medium text-board-blue dark:text-[#579DFF]" : "text-board-subtle dark:text-[#9FADBC]"}`}>
                  {dragOn ? "Drop here" : "No tasks here"}
                </p>
                {!dragOn && (
                  <button
                    onClick={onAdd}
                    className="text-[13px] font-medium text-board-blue hover:underline dark:text-[#579DFF]"
                  >
                    + Add one
                  </button>
                )}
              </div>
            ) : (
              tasks.map((t, i) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  index={i}
                  dimmed={dragOn}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
            {dragOn && tasks.length > 0 && !snapshot.isDraggingOver && (
              <div className="rounded-lg border border-dashed border-board-border py-2 text-center text-[11px] text-board-subtle/70 dark:border-[#39424E] dark:text-[#9FADBC]/70">
                Drop here
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
