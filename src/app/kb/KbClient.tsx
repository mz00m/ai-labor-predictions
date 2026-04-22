"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function KbClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setLoading(true);

    try {
      const res = await fetch("/api/kb/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error ${res.status}: ${errText}` },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: text };
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="text-xs font-mono text-neutral-400 mb-1">jobsdata.ai</div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            530+ verified sources, 18 predictions, full methodology
          </p>
        </div>

        {messages.length === 0 && (
          <div className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              "What sources cover tech sector displacement?",
              "How is the weighted average calculated?",
              "Which predictions have the most Tier 1 evidence?",
              "Summarize the freelancer wage impact findings",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="text-left text-sm px-4 py-3 rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-6 mb-8">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              {m.role === "user" ? (
                <div className="max-w-lg bg-neutral-100 rounded-2xl px-4 py-3 text-sm text-neutral-900">
                  {m.content}
                </div>
              ) : (
                <div className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                  {m.content}
                  {loading && i === messages.length - 1 && m.content === "" && (
                    <span className="inline-block w-2 h-4 bg-neutral-300 animate-pulse ml-0.5 align-text-bottom" />
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-1 items-center text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce [animation-delay:300ms]" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={submit} className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the research..."
            className="flex-1 text-sm px-4 py-3 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 rounded-lg bg-neutral-900 text-white text-sm font-medium disabled:opacity-40 hover:bg-neutral-700 transition-colors"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
