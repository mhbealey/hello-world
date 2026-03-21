"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardShell } from "@/components/layouts";
import { ErrorBanner } from "@/components/shared";
import { content } from "@/lib/utils/content";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.slice(-10),
        }),
      });

      if (!res.ok) throw new Error("Chat failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setError(content.errors.chatError);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <DashboardShell title="Chat">
      <div className="flex h-[calc(100vh-12rem)] flex-col">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto pb-4"
        >
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-textSecondary">
                  Ask about your cybersecurity posture
                </p>
                <p className="mt-1 text-xs text-textTertiary">
                  e.g. &quot;What are our top risks?&quot; or &quot;Explain our AI exposure&quot;
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-surfaceDim text-text"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {error && (
            <div className="px-1">
              <ErrorBanner
                message={error}
                onRetry={() => {
                  setError(null);
                  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
                  if (lastUserMsg) {
                    setInput(lastUserMsg.content);
                  }
                }}
              />
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-surfaceDim px-3 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-textTertiary [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-textTertiary [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-textTertiary [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-border pt-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your cyber posture..."
            disabled={loading}
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-textTertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
