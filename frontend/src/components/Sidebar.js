
"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          w-64 min-h-screen bg-slate-950 text-white p-5
          transform transition-transform duration-300
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">
            DocuMind AI
          </h1>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 hover:bg-slate-800 rounded"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="mt-8">
          <p className="text-xs text-slate-400 mb-4">
            WORKSPACE
          </p>

          <div
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 cursor-pointer"
          >
            <FileText size={18} />
            <span className="text-sm">Documents</span>
          </div>

          <div
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 mt-2 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <MessageSquare size={18} />
            <span className="text-sm">Chat History</span>
          </div>
        </div>
      </aside>
    </>
  );
}
