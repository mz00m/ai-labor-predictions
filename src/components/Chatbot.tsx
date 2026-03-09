"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What does the data say about AI job displacement?",
  "How are wages being affected by AI?",
  "What is the current AI adoption rate?",
  "Which sectors are most exposed to AI?",
];

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="4" y1="4" x2="14" y2="14" />
      <line x1="14" y1="4" x2="4" y2="14" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/** Inline trigger button for the navbar */
export function ChatTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[var(--accent)] hover:bg-[#4b50e5] px-3 py-1.5 rounded-md transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      Ask
    </button>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        if (abortRef.current) abortRef.current.abort();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Expose open method for navbar trigger
  useEffect(() => {
    function handleOpenChat() {
      setOpen(true);
    }
    window.addEventListener("open-chatbot", handleOpenChat);
    return () => window.removeEventListener("open-chatbot", handleOpenChat);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;

      setError(null);
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      const updatedMessages = [...messages, userMsg];
      setMessages([...updatedMessages, assistantMsg]);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === "delta") {
                fullText += event.text;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last.role === "assistant") {
                    copy[copy.length - 1] = { ...last, content: fullText };
                  }
                  return copy;
                });
              } else if (event.type === "error") {
                throw new Error(event.error);
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        // Remove empty assistant message on error
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/[0.15] backdrop-blur-[2px]"
        onClick={() => {
          setOpen(false);
          if (abortRef.current) abortRef.current.abort();
        }}
      />

      {/* Chat panel — anchored top-right, below navbar */}
      <div
        ref={panelRef}
        className="fixed top-14 right-4 sm:right-8 z-[70] w-[400px] max-w-[calc(100vw-2rem)] h-[min(560px,calc(100vh-5rem))] bg-white rounded-xl border border-black/[0.08] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06] bg-[var(--accent)] text-white shrink-0">
          <div>
            <h3 className="text-[14px] font-semibold">
              Ask the data
            </h3>
            <p className="text-[11px] text-white/70">
              300+ sources across 17 predictions
            </p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              if (abortRef.current) abortRef.current.abort();
            }}
            className="p-1 rounded-md hover:bg-white/[0.15] text-white/80 hover:text-white"
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-[13px] text-[var(--muted)] leading-relaxed">
                Ask anything about AI&apos;s impact on jobs, wages, and adoption.
              </p>
              <div className="space-y-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="block w-full text-left text-[12px] text-[var(--accent)] hover:text-[var(--foreground)] hover:bg-[var(--accent-light)] rounded-md px-3 py-2 border border-black/[0.05]"
                    style={{ transition: "background-color 0.15s ease, color 0.15s ease" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-black/[0.03] text-[var(--foreground)]"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="whitespace-pre-wrap">
                    {msg.content || (
                      <span className="inline-block w-1.5 h-4 bg-[var(--muted)] rounded-sm animate-pulse" />
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 rounded-md px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-black/[0.06] px-3 py-2 flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about AI labor data..."
            rows={1}
            disabled={streaming}
            className="flex-1 resize-none text-[13px] leading-relaxed bg-transparent outline-none placeholder:text-[var(--muted)] disabled:opacity-50 max-h-24 overflow-y-auto"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="shrink-0 p-2 rounded-md bg-[var(--accent)] text-white disabled:opacity-30"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </>
  );
}
