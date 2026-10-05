export default function Footer() {
  return (
    <footer className="border-t border-board-border bg-white dark:border-[#2C333A] dark:bg-[#1D2125]">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 text-[13px] text-board-subtle dark:text-[#9FADBC]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-board-green" /> All systems operational
        </span>
      </div>
    </footer>
  );
}
