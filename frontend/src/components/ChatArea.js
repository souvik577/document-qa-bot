
import { Bot } from "lucide-react";

export default function ChatArea() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">

      <div className="bg-blue-100 p-4 rounded-2xl mb-5">
        <Bot size={36} className="text-blue-600" />
      </div>

      <h2 className="text-3xl font-bold text-slate-800">
        Chat with your Documents
      </h2>

      <p className="text-slate-500 mt-3 text-center">
        Upload a PDF and ask questions about its content.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-xl w-full">

        <div className="border rounded-xl p-5">
          <h3 className="font-semibold">Understand Documents</h3>
          <p className="text-sm text-slate-500 mt-2">
            Get answers from your uploaded PDFs.
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-semibold">Source References</h3>
          <p className="text-sm text-slate-500 mt-2">
            Find the page where information appears.
          </p>
        </div>

      </div>
    </div>
  );
}
