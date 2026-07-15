import { useEffect, useRef, useState } from "react";
import { getAssistantReply } from "../Services/assistant";
import type { AssistantMessage } from "../Services/assistant";
import { APP_NAME } from "../utils/constants";

const SUGGESTIONS = [
  "What is Re-Trace?",
  "How do I recycle a product?",
  "How many points do I earn?",
];

let counter = 0;
const nextId = () => `m${counter++}`;

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: nextId(),
      role: "assistant",
      content: `Hi! I'm the ${APP_NAME} assistant. Ask me about passports, repairs, recycling, or points.`,
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const userMsg: AssistantMessage = {
      id: nextId(),
      role: "user",
      content: text,
    };
    const reply: AssistantMessage = {
      id: nextId(),
      role: "assistant",
      content: getAssistantReply(text),
    };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-blink rounded-full bg-green-400" />
              <span className="font-semibold">{APP_NAME} Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="text-slate-300 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={
                    "inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm " +
                    (m.role === "user"
                      ? "bg-green-500 text-white"
                      : "bg-white text-slate-700 ring-1 ring-slate-200")
                  }
                >
                  {m.content}
                </span>
              </div>
            ))}

            {messages.length <= 1 && (
              <div className="space-y-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full rounded-lg bg-white px-3 py-2 text-left text-xs text-slate-600 ring-1 ring-slate-200 hover:ring-green-400"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-slate-200 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              aria-label="Message"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="animate-pulse-glow flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:bg-green-600"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
