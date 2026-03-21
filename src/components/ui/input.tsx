"use client";

import { useCallback } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  helper?: string;
  error?: string;
  dollar?: boolean;
  onChange?: (value: string) => void;
}

export function Input({
  label,
  helper,
  error,
  dollar = false,
  onChange,
  className = "",
  ...props
}: InputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (dollar) {
        val = val.replace(/[^0-9.]/g, "");
      }
      onChange?.(val);
    },
    [onChange, dollar]
  );

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[14px] font-medium text-text-primary">{label}</label>
      )}
      <div className="relative">
        {dollar && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">
            $
          </span>
        )}
        <input
          className={`
            w-full h-11 bg-bg-input border rounded-[12px] text-[16px] text-text-primary
            placeholder:text-text-tertiary
            focus:outline-none focus:border-border-focus
            transition-colors duration-200
            ${dollar ? "pl-7 pr-3" : "px-3"}
            ${error ? "border-loss-red" : "border-border-default"}
            ${className}
          `}
          onChange={handleChange}
          {...props}
        />
      </div>
      {helper && !error && (
        <p className="text-[12px] text-text-secondary">{helper}</p>
      )}
      {error && (
        <p className="text-[12px] text-loss-red">{error}</p>
      )}
    </div>
  );
}
