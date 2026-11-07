
"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, User, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Sidebar from "@/components/Sidebar";
import UploadDocument from "@/components/UploadDocument";
import ChatInput from "@/components/ChatInput";

import { askQuestion } from "@/lib/api";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleAsk(question) {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
    ]);

    setLoading(true);
    setError("");

    try {
      const result = await askQuestion(question, uploadedFile.filename);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources || [],
        },
      ]);
        } catch (err) {
          setError(
            typeof err.message === "string"
              ? err.message
              : JSON.stringify(err.message)
          );
        } finally {
          setLoading(false);
        }
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <section className="flex-1 flex flex-col min-w-0">

        <header className="border-b bg-white p-5 pl-16 md:pl-5">
          <h1 className="font-bold text-xl text-slate-800">
            Document Q&A Assistant
          </h1>
          <p className="text-sm text-slate-500">
            Ask questions about your uploaded documents.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {!uploadedFile && (
            <div className="max-w-xl mx-auto mt-12">
              <UploadDocument
                onUploadSuccess={(result) => {
                  setUploadedFile(result);
                  setMessages([]);
                  setError("");
                }}
              />
            </div>
          )}

          {uploadedFile && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
              <FileText size={18} />
              {uploadedFile.filename} – Indexed successfully
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className="flex gap-3 max-w-3xl mx-auto">

              <div className="mt-1">
                {message.role === "user" ? (
                  <User size={22} className="text-blue-600" />
                ) : (
                  <Bot size={22} className="text-green-600" />
                )}
              </div>

              <div className="flex-1 bg-white border rounded-xl p-4">
                <p className="text-sm font-semibold mb-2 text-slate-600">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </p>

                <div className="text-sm text-slate-700 leading-7">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-slate-900">{children}</strong>
                      ),
                    }}
                  >
                    {typeof message.content === "string"
                      ? message.content
                      : message.content
                          ?.filter((item) => item.type === "text")
                          .map((item) => item.text)
                          .join("\n") || ""}
                  </ReactMarkdown>
                </div>

                {message.sources?.map((source, i) => (
                  <div
                    key={i}
                    className="mt-3 text-xs text-blue-700 bg-blue-50 p-2 rounded"
                  >
                    Source: {source.source} | Page: {source.page}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Bot size={22} className="text-green-600 mt-1" />

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  AI Assistant
                </p>

                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 text-center">
              {error}
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-3 sm:p-5">
          <div className="max-w-3xl mx-auto w-full min-w-0">
            <ChatInput
              onSend={handleAsk}
              loading={loading}
              disabled={!uploadedFile}
            />
          </div>
        </div>

      </section>
    </main>
  );
}
