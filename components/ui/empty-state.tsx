interface EmptyStateProps {
  message: string;
  cta?: string;
  onAction?: () => void;
}

export function EmptyState({ message, cta, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
      <p className="text-sm text-textSecondary">{message}</p>
      {cta && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          {cta}
        </button>
      )}
    </div>
  );
}
