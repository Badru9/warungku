import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${className}`}>
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {eyebrow}
          </p>
        )}
        <h1
          className="text-4xl md:text-5xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
