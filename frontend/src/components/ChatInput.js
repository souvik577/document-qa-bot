
"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, loading, disabled }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!question.trim() || loading || disabled) return;

    onSend(question.trim());
    setQuestion("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 sm:gap-3 w-full min-w-0"
    >
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={
          disabled
            ? "Upload a PDF first..."
            : "Ask something about your document..."
        }
        disabled={disabled || loading}
        className="flex-1 min-w-0 w-full px-3 sm:px-4 py-3 text-sm text-slate-900
        placeholder:text-slate-400
        border border-slate-300 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:border-blue-500"
      />

      <button
        type="submit"
        disabled={disabled || loading || !question.trim()}
        className="shrink-0 bg-blue-600 text-white px-4 sm:px-5 rounded-xl
        hover:bg-blue-700 disabled:opacity-50
        flex items-center justify-center"
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  );
}
