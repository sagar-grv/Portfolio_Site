import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  RefreshCcw,
} from "lucide-react";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "";
const API = `${BACKEND_URL}/api`;
const HAS_BACKEND = Boolean(BACKEND_URL.trim());

const SUGGESTIONS = [
  "Summarise Sagar's strongest projects",
  "What's his experience with GenAI?",
  "Which tech stack does he know best?",
  "Is he open to internships?",
];

const storageKey = "sg_chat_session";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(true);
  const [sessionId, setSessionId] = useState(
    () => localStorage.getItem(storageKey) || ""
  );
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hey! I'm Sagar's AI — grounded on his resume and top GitHub repos. Ask me anything about his projects, skills or experience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (sessionId) localStorage.setItem(storageKey, sessionId);
  }, [sessionId]);

  useEffect(() => {
    // Dismiss teaser after first open
    if (open) setTeaser(false);
  }, [open]);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      // Autofocus input after open animation
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [open, messages, sending]);

  const send = async (text) => {
    const clean = (text ?? input).trim();
    if (!clean || sending) return;
    setMessages((m) => [...m, { role: "user", text: clean }]);
    setInput("");

    if (!HAS_BACKEND) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            "The AI chat is not connected in this deployment yet. The portfolio itself is live, and this feature can be enabled later once a backend is configured.",
        },
      ]);
      return;
    }

    setSending(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        message: clean,
        session_id: sessionId || undefined,
      });
      const data = res.data;
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply || "(no response)" },
      ]);
    } catch (err) {
      const detail =
        err?.response?.data?.detail || err?.message || "Unknown error";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `Something went wrong reaching the AI: ${detail}. Try again in a moment, or email sagargurav1812@gmail.com.`,
          error: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        text: "Fresh chat. What would you like to know about Sagar?",
      },
    ]);
    localStorage.removeItem(storageKey);
    setSessionId("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {/* Panel */}
      <div
        className={`absolute bottom-16 right-0 w-[min(92vw,380px)] origin-bottom-right transition-all duration-300 ease-out ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--card)]">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-[#0a0a0b] flex items-center justify-center font-bold font-mono">
                SG
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--card)] animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm text-[var(--text)]">
                  Sagar&apos;s AI
                </span>
                <span className="text-[10px] font-mono text-[var(--accent)] px-1.5 py-0.5 rounded bg-[var(--accent-soft)] border border-[var(--border)]">
                  gemini
                </span>
              </div>
              <div className="text-[11px] font-mono text-[var(--text-dim)]">
                grounded on resume + github
              </div>
            </div>
            <button
              onClick={reset}
              title="New chat"
              className="p-1.5 rounded-md text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-white/5 transition"
            >
              <RefreshCcw size={14} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-white/5 transition"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="px-4 py-4 max-h-[58vh] min-h-[320px] overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {sending && <Typing />}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !sending && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elev)]/60 text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 border-t border-[var(--border)] bg-[var(--card)]"
          >
            <div className="flex items-end gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 focus-within:border-[var(--accent)] transition">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask about Sagar's projects, skills, experience..."
                className="flex-1 resize-none bg-transparent outline-none text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] min-h-[22px] max-h-24"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="shrink-0 w-9 h-9 rounded-lg bg-[var(--accent)] text-[#0a0a0b] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--accent-strong)] transition"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="mt-2 text-[10px] font-mono text-[var(--text-dim)] flex items-center gap-1.5">
              <Sparkles size={10} className="text-[var(--accent)]" />
              {HAS_BACKEND
                ? "Answers are AI-generated from Sagar's resume & GitHub — verify anything critical."
                : "AI chat is disabled in this deployment until a backend is connected."}
            </p>
          </form>
        </div>
      </div>

      {/* Teaser bubble */}
      {!open && teaser && (
        <div className="absolute bottom-16 right-0 mb-1 w-60 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 shadow-lg fade-up">
          <div className="text-xs text-[var(--text)]">
            <span className="text-[var(--accent)] font-mono">›</span> Ask my AI
            about my projects — it knows my resume &amp; GitHub.
          </div>
          <div className="absolute -bottom-1.5 right-5 w-3 h-3 rotate-45 bg-[var(--bg-elev)] border-b border-r border-[var(--border)]" />
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-14 h-14 rounded-full bg-[var(--accent)] text-[#0a0a0b] flex items-center justify-center shadow-[0_18px_50px_-10px_rgba(163,230,53,0.55)] hover:scale-105 active:scale-95 transition-transform group"
        aria-label="Open chat"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-50 group-hover:opacity-0 animate-ping" />
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--bg)] text-[var(--accent)] border border-[var(--border)] text-[10px] font-mono flex items-center justify-center">
            AI
          </span>
        )}
      </button>
    </div>
  );
};

const Bubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[var(--accent-soft)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center mr-2 mt-0.5 shrink-0">
          <Bot size={13} />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[var(--accent)] text-[#0a0a0b] rounded-br-sm"
            : msg.error
            ? "bg-[#2a1a1a] border border-red-900/50 text-[#f5d7d7] rounded-bl-sm"
            : "bg-[var(--card)] border border-[var(--border)] text-[var(--text)] rounded-bl-sm"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

const Typing = () => (
  <div className="flex items-center gap-2 pl-9">
    <div className="flex gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.2s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.1s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" />
    </div>
    <span className="text-[11px] font-mono text-[var(--text-dim)]">
      thinking…
    </span>
  </div>
);

export default Chatbot;
