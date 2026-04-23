import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type Item = { to: string; num: string; label: string; end?: boolean };

const nav: Item[] = [
  { to: "/", num: "00", label: "Overview", end: true },
  { to: "/authors", num: "01", label: "Authors" },
  { to: "/books", num: "02", label: "Books" },
  { to: "/reviews", num: "03", label: "Reviews" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 sticky top-0 h-screen flex flex-col bg-paper-deep border-r border-rule">
      <header className="px-7 pt-9 pb-7 border-b border-rule">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
          Est. 2026 · No. 01
        </div>
        <div className="mt-4 font-display text-[32px] leading-none font-semibold tracking-tight">
          Haibazo
        </div>
        <div className="font-display italic text-xl leading-tight text-accent mt-0.5">
          Book Review
        </div>
      </header>
      <nav className="flex-1 py-3">
        {nav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      <footer className="px-7 py-5 border-t border-rule font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint leading-relaxed">
        v0.1 / Intern Test
        <br />
        Round 02 — 2026
      </footer>
    </aside>
  );
};

export default Sidebar;

function NavItem({ to, num, label, end }: Item) {
  return (
    <NavLink to={to} end={end} className="block">
      {({ isActive }) => (
        <div
          className={cn(
            "relative flex items-baseline gap-5 px-7 py-3 transition-colors duration-200",
            isActive
              ? "bg-paper text-ink"
              : "text-ink-muted hover:text-ink hover:bg-paper/50",
          )}
        >
          <span
            className={cn(
              "absolute left-0 top-2 bottom-2 w-[2px] transition-colors duration-200",
              isActive ? "bg-accent" : "bg-transparent",
            )}
            aria-hidden
          />
          <span className="font-mono text-xs tabular-nums tracking-wider">
            {num}
          </span>
          <span className="font-display text-lg leading-tight">{label}</span>
        </div>
      )}
    </NavLink>
  );
}
