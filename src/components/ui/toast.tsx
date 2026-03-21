"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const borderColors: Record<ToastType, string> = {
  success: "border-l-gain-green",
  error: "border-l-loss-red",
  info: "border-l-accent-blue",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [{ id, message, type }, ...prev].slice(0, 2));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto w-full max-w-[390px]
              bg-bg-surface border border-border-default border-l-4 ${borderColors[toast.type]}
              rounded-[12px] px-4 py-3 flex items-center justify-between gap-3
              animate-[slideDown_200ms_ease-out]
            `}
            role="alert"
            aria-live="polite"
          >
            <p className="text-[14px] text-text-primary">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-text-tertiary hover:text-text-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
