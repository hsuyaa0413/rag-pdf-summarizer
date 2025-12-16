"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const ChatPage = () => {
  const router = useRouter()

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

        {/* Body */}
        <div className="grid grid-cols-5 h-[80vh]">
          <div className="col-span-3">
            <object
              data="https://res.cloudinary.com/delchtyqv/image/upload/v1733686722/zg8nvapfro9dlramraid.pdf"
              type="application/pdf"
              className="w-full h-[80vh] rounded-bl-lg"
            />
          </div>

          {/* Candidate Info Panel */}
          <div className="col-span-2 bg-blue-100 p-6 overflow-y-auto rounded-r-lg">
            <h2 className="text-2xl font-bold mb-4">Chatbot</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
