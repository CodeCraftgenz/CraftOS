/// Botão reutilizável com variantes premium

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "warning" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<string, string> = {
  primary: "bg-primary hover:bg-primary-light text-white shadow-sm shadow-primary/20 hover:shadow-primary/30",
  danger: "bg-danger hover:bg-danger-dark text-white shadow-sm shadow-danger/20",
  warning: "bg-warning hover:bg-warning-dark text-text-inverse shadow-sm shadow-warning/20",
  ghost: "bg-transparent hover:bg-bg-card-hover text-text-secondary hover:text-text-primary",
  outline: "bg-transparent border border-border hover:border-border-light text-text-secondary hover:text-text-primary hover:bg-bg-card-hover",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-1.5 text-[12px] gap-1.5 rounded-md",
  md: "px-5 py-2 text-[13px] gap-2 rounded-md",
  lg: "px-6 py-2.5 text-[14px] gap-2.5 rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold whitespace-nowrap
        transition-all duration-150 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.97]
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-20" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
