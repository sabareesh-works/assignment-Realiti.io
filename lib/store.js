const KEY = "task-board-v1";

export const COLUMNS = [
  { id: "todo", title: "TO DO" },
  { id: "progress", title: "IN PROGRESS" },
  { id: "done", title: "DONE" },
];

export function loadTasks() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

// small demo data so first look isn't empty
export function demoTasks() {
  return [
    {
      id: "TB-1",
      title: "Design login empty state",
      desc: "Add illustration + copy for first-time users.",
      status: "todo",
      type: "Story",
      priority: "Medium",
      createdAt: Date.now(),
    },
    {
      id: "TB-2",
      title: "Fix drag on mobile",
      desc: "Cards jump when scrolling, check touch sensors.",
      status: "progress",
      type: "Bug",
      priority: "High",
      createdAt: Date.now(),
    },
    {
      id: "TB-3",
      title: "Persist board to localStorage",
      desc: "Save on every change, restore on reload.",
      status: "done",
      type: "Task",
      priority: "Low",
      createdAt: Date.now(),
    },
  ];
}
