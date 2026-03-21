"use client";

import { useEffect, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "error";
}

let addToastFn: ((message: string, type?: "success" | "error") => void) | null =
  null;

export function toast(message: string, type?: "success" | "error") {
  addToastFn?.(message, type);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  return (
    <>
      {children}
      <div className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-slide-up rounded-lg px-4 py-3 text-sm font-medium text-white shadow-md ${
              t.type === "error" ? "bg-danger" : "bg-text"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
