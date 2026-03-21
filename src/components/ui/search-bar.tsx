"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchResult {
  ticker: string;
  name: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSelect: (ticker: string) => void;
}

export function SearchBar({ placeholder = "Search...", onSearch, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await onSearch(query);
        setResults(r);
        setOpen(r.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, onSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 bg-bg-input border border-border-default rounded-[12px] pl-10 pr-10 text-[16px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-focus transition-colors"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary animate-spin" />
        )}
        {!loading && query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-tertiary"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-default rounded-[12px] overflow-hidden z-40 max-h-[300px] overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.ticker}
              onClick={() => { onSelect(r.ticker); setQuery(""); setOpen(false); }}
              className="w-full px-4 py-3 text-left hover:bg-bg-surface-hover transition-colors flex items-center gap-3 min-h-[44px]"
            >
              <span className="text-[14px] font-mono font-medium text-text-primary">{r.ticker}</span>
              <span className="text-[14px] text-text-secondary truncate">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
