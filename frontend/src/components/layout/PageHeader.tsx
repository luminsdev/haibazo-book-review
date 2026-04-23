import { type ReactNode } from "react";

type Props = {
  section: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

const PageHeader = ({ section, title, description, action }: Props) => {
  return (
    <header className="mb-14 border-b border-rule pb-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-ink-muted">
          {section}
        </div>
        <h1 className="mt-4 font-display font-semibold text-[64px] leading-[0.95] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-ink-muted text-[17px] leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
};

export default PageHeader;
