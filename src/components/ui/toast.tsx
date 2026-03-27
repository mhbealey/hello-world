"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

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

const accentColors: Record<ToastType, string> = {
  success: "border-l-gain-green",
  error: "border-l-loss-red",
  info: "border-l-accent-blue",
};

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const iconColors: Record<ToastType, string> = {
  success: "text-gain-green",
  error: "text-loss-red",
  info: "text-accent-blue",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [{ id, message, type }, ...prev].slice(0, 3));
    // Errors persist until dismissed; success/info auto-dismiss after 5s
    if (type !== "error") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none">
        {toasts.map((toast, i) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto w-full max-w-[390px]
                bg-bg-elevated border border-border-default border-l-4 ${accentColors[toast.type]}
                rounded-xl px-4 py-3 flex items-center gap-3
                animate-[slideDown_300ms_cubic-bezier(0.16,1,0.3,1)]
                shadow-[0_4px_12px_rgba(0,0,0,0.4)]
              `}
              style={{ animationDelay: `${i * 50}ms` }}
              role="alert"
              aria-live={toast.type === "error" ? "assertive" : "polite"}
            >
              <Icon className={`h-4 w-4 shrink-0 ${iconColors[toast.type]}`} />
              <p className="text-sm text-text-primary flex-1">{toast.message}</p>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-text-tertiary hover:text-text-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
