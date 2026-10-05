"use client";
import { useEffect, useState } from "react";
import { MousePointer2, X, ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";

const SEEN_KEY = "task-board-tour-seen";

function steps(hasCard) {
  const all = [
    {
      id: "welcome",
      target: null,
      title: "Welcome to your Task Board",
      text: "This is a mini task board. In 30 seconds I'll show you how to search, create and move tasks.",
    },
    {
      id: "search",
      target: '[data-tour="search"]',
      gesture: "tap",
      title: "Find anything fast",
      text: "Type here to filter cards by title, description or ID like TB-2.",
    },
    {
      id: "add",
      target: '[data-tour="add"]',
      gesture: "tap",
      title: "Create a task",
      text: "Tap here, give it a title, and it lands straight in To Do.",
    },
    {
      id: "drag",
      target: ".board-card",
      needCard: true,
      gesture: "drag",
      title: "Drag cards to move them",
      text: "Hold the grip handle on any card and drop it in another status. It saves automatically.",
    },
    {
      id: "edit",
      target: '.board-card [title="Edit"]',
      needCard: true,
      gesture: "tap",
      title: "Edit or change status",
      text: "Tap the pencil to edit details — or move the card by changing its Status field. Great on mobile.",
    },
    {
      id: "done",
      target: null,
      title: "You're all set",
      text: "Everything saves to this browser, so your board survives a refresh. Tap a card to open its full task view. Replay this guide anytime from the ? button.",
    },
  ];
  return all.filter((s) => !s.needCard || hasCard);
}

export default function Tour({ startSignal }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState(null);
  const [list, setList] = useState([]);

  // auto-start on very first visit
  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) {
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  // replay button
  useEffect(() => {
    if (startSignal > 0) {
      setIdx(0);
      setOpen(true);
    }
  }, [startSignal]);

  // refresh step list whenever tour opens
  useEffect(() => {
    if (open) {
      setList(steps(!!document.querySelector(".board-card")));
      setIdx(0);
    }
  }, [open]);

  const step = list[idx];

  // pin the target to the top of the screen — the card docks at the
  // bottom, so the two can never overlap
  useEffect(() => {
    if (!open || !step) return;
    if (!step.target) {
      setRect(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    let raf;
    const measure = () => {
      const el = document.querySelector(step.target);
      if (!el) {
        setRect(null);
        return;
      }
      el.scrollIntoView({ block: "start", behavior: "smooth" });
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }, 380);
    };
    measure();
    const onMove = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.querySelector(step.target);
        if (!el) return;
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      });
    };
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
      cancelAnimationFrame(raf);
    };
  }, [open, step]);

  if (!open || !step) return null;

  const last = idx === list.length - 1;

  function close(seen = true) {
    setOpen(false);
    try {
      if (seen) localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }

  // arrow cursor only, parked on the target
  let cursor = null;
  if (rect && step.gesture === "tap") {
    cursor = { x: rect.left + rect.width / 2 - 8, y: rect.top + rect.height / 2 - 6 };
  } else if (rect && step.gesture === "drag") {
    cursor = { x: rect.left + 10, y: rect.top + rect.height / 2 - 10 };
  }

  return (
    <>
      {/* dim layer */}
      <div className="fixed inset-0 z-50 bg-board-navy/60 modal-bg" />

      {/* spotlight ring */}
      {rect && (
        <div
          className="fixed z-50 rounded-xl ring-4 ring-white shadow-pop transition-all duration-300 pointer-events-none"
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
        />
      )}

      {/* arrow cursor only */}
      {cursor && (
        <div className="fixed z-50 pointer-events-none" style={{ top: cursor.y, left: cursor.x }}>
          <MousePointer2
            size={30}
            fill="#fff"
            className={`text-board-navy ${step.gesture === "drag" ? "tour-drag" : "tour-tap"}`}
            style={{ filter: "drop-shadow(0 2px 6px rgba(9,30,66,.5))" }}
          />
        </div>
      )}

      {/* skip (always visible) */}
      <button
        onClick={() => close()}
        className="fixed top-3 right-3 z-[60] flex items-center gap-1 rounded-full bg-white/95 px-3.5 py-2 text-[13px] font-medium text-board-navy shadow-pop dark:bg-[#22272B] dark:text-white"
      >
        <X size={15} /> Skip
      </button>

      {/* docked guide card — always at the bottom, never over the target */}
      <div className="fixed z-[60] left-3 right-3 bottom-3 sm:left-1/2 sm:right-auto sm:bottom-6 sm:w-[380px] sm:-translate-x-1/2 rounded-2xl bg-white p-4 shadow-pop card-enter dark:bg-[#22272B] dark:border dark:border-[#39424E]">
        <p className="text-[11px] font-bold tracking-wider text-board-subtle dark:text-[#9FADBC]">
          STEP {idx + 1} OF {list.length}
        </p>
        <h3 className="mt-1 text-[15px] font-semibold text-board-navy dark:text-white flex items-center gap-1.5">
          {step.id === "done" && <PartyPopper size={16} className="text-board-green" />}
          {step.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-board-subtle dark:text-[#9FADBC]">{step.text}</p>

        <div className="mt-3 flex items-center gap-1.5">
          {list.map((s, i) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-board-blue" : "w-1.5 bg-board-border dark:bg-white/20"}`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {idx > 0 && (
            <button
              onClick={() => setIdx(idx - 1)}
              className="flex items-center gap-1 rounded px-3 py-2 text-[13px] text-board-subtle hover:bg-board-bg dark:text-[#9FADBC] dark:hover:bg-white/10"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}
          <button
            onClick={() => close()}
            className="rounded px-3 py-2 text-[13px] text-board-subtle hover:bg-board-bg dark:text-[#9FADBC] dark:hover:bg-white/10"
          >
            Skip
          </button>
          <button
            onClick={() => (last ? close() : setIdx(idx + 1))}
            className="ml-auto flex items-center gap-1 rounded bg-board-blue px-4 py-2 text-[13px] font-medium text-white hover:bg-board-bright"
          >
            {last ? "Get started" : step.id === "welcome" ? "Take the tour" : "Next"}
            {!last && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </>
  );
}
