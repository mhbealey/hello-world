"use client";

import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent-blue hover:bg-accent-blue-hover text-white",
  secondary: "bg-bg-surface hover:bg-bg-surface-hover text-text-primary border border-border-default",
  danger: "bg-loss-red hover:bg-loss-red/80 text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[14px]",
  md: "h-10 px-4 text-[14px]",
  lg: "h-12 px-6 text-[16px]",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-[12px] font-medium
        transition-colors duration-200 min-w-[44px] min-h-[44px]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
