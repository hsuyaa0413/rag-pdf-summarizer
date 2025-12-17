"use client"
import Chatbot from "@/components/Chatbot"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

const ChatContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pdfUrl = searchParams?.get("pdf_url")

  return (
    <div className="relative z-10 flex-1 flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-6 md:mb-8">
        <Button
          variant="outline"
          className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all font-medium"
          onClick={() => router.push("/upload-pdf")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
        <h1 className="hidden md:block font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 tracking-tight">
          RAG PDF Summarizer
        </h1>
        <div className="w-[100px] md:hidden"></div>{" "}
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[600px]">
        {/* PDF Viewer Section */}
        <div className="flex flex-col h-[500px] lg:h-[80vh] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              PDF View
            </span>
          </div>
          <object
            data={pdfUrl || ""}
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="flex items-center justify-center h-full text-neutral-500">
              <p>
                Unable to display PDF.{" "}
                <a
                  href={pdfUrl || ""}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-blue-500"
                >
                  Download
                </a>{" "}
                instead.
              </p>
            </div>
          </object>
        </div>

        {/* Chatbot Section */}
        <div className="flex flex-col h-[600px] lg:h-[80vh] bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden ring-1 ring-neutral-950/5 dark:ring-neutral-50/5">
          <div className="flex-1 overflow-hidden relative">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  )
}

const ChatPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-neutral-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            Loading Chat...
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </div>
  )
}

export default ChatPage
