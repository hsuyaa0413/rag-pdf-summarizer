"use client"
import Chatbot from "@/components/Chatbot"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const ChatPage = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const pdfUrl = searchParams?.get("pdf_url")

  return (
    <div className="w-full">
      <h1 className="font-bold text-4xl mt-6 mb-3 text-center">
        RAG PDF Summarizer
      </h1>
      <div className="m-10">
        {/* Header */}
        <Button
          variant="outline"
          className="text-gray-600 mb-2 "
          onClick={() => router.push("/upload-pdf")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Upload
        </Button>

        <div className="grid grid-cols-5 h-[80vh]">
          <div className="col-span-3">
            <object
              data={pdfUrl || ""}
              type="application/pdf"
              className="w-full h-[80vh] rounded-bl-lg"
            />
          </div>

          {/* chatbot */}
          <div className="col-span-2 h-full bg-blue-100 p-6 overflow-y-auto rounded-r-lg">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
