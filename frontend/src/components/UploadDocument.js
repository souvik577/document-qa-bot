
"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { uploadDocument } from "@/lib/api";

export default function UploadDocument({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await uploadDocument(file);

      onUploadSuccess(result);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  return (
    <div className="w-full max-w-xl border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">

      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 bg-blue-100 rounded-xl">
          <FileText className="text-blue-600" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-800">
            Upload Document
          </h2>
          <p className="text-sm text-slate-500">
            Select a PDF to start asking questions.
          </p>
        </div>
      </div>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-blue-500 transition">

        <Upload size={30} className="text-blue-600 mb-3" />

        <span className="text-sm font-medium text-slate-700">
          Click to select PDF
        </span>

        <span className="text-xs text-slate-400 mt-2">
          PDF files only
        </span>

        <input
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {file && (
        <p className="text-sm text-slate-600 mt-4">
          Selected: {file.name}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-3">
          {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full mt-5 flex justify-center items-center gap-2 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload PDF
          </>
        )}
      </button>

    </div>
  );
}
