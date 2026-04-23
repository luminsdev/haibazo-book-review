import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <div className="font-mono text-xs tracking-[0.25em] uppercase text-ink-muted">
        Issue No. 01 · April 2026
      </div>

      <h1 className="mt-5 font-display font-semibold text-[88px] leading-[0.92] tracking-tight max-w-4xl">
        A quiet ledger of{" "}
        <em className="text-accent not-italic font-display">books</em> and the
        people who wrote them.
      </h1>

      <p className="mt-10 max-w-lg text-lg text-ink-muted leading-relaxed">
        Three sections. Six screens. One humble goal — keep the catalogue clean,
        the reviews honest, and the authors in order.
      </p>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl border-t border-rule pt-10">
        <StatLink num="01" label="Authors" blurb="The voices." to="/authors" />
        <StatLink num="02" label="Books" blurb="The works." to="/books" />
        <StatLink
          num="03"
          label="Reviews"
          blurb="The verdicts."
          to="/reviews"
        />
      </div>
    </div>
  );
}

function StatLink({
  num,
  label,
  blurb,
  to,
}: {
  num: string;
  label: string;
  blurb: string;
  to: string;
}) {
  return (
    <Link to={to} className="group block">
      <div className="font-mono text-[11px] tracking-[0.25em] text-ink-faint">
        {num}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold transition-colors group-hover:text-accent">
        {label}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
      <div className="mt-1 text-sm text-ink-muted italic">{blurb}</div>
    </Link>
  );
}
