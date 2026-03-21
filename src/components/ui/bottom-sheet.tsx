"use client";

import { useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose} role="dialog" aria-modal="true" aria-label={title || "Bottom sheet"}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-bg-surface border-t border-border-default rounded-t-[16px] max-h-[85vh] overflow-y-auto animate-[slideUp_300ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-text-tertiary" />
        </div>
        {title && (
          <h2 className="text-[18px] font-semibold text-text-primary px-[16px] pb-2">
            {title}
          </h2>
        )}
        <div className="px-[16px] pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
          {children}
        </div>
      </div>
    </div>
  );
}
