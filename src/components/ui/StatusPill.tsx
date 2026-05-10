interface StatusPillProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function StatusPill({
  children,
  variant = "default",
  className = "",
}: StatusPillProps) {
  const variantClasses = {
    default: "bg-accent-soft text-accent",
    success: "bg-success-soft text-success-foreground",
    warning: "bg-warning-soft text-warning-foreground",
    danger: "bg-danger-soft text-danger-foreground",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full
        text-xs font-semibold uppercase tracking-wider
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
