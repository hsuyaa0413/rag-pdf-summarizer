"use client"

import { FileUpload } from "@/components/ui/file-upload"
import { useRouter } from "next/navigation"
import { useState } from "react"

const FileUploadPage = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successUrl, setSuccessUrl] = useState<string | null>(null)

  const router = useRouter()

  const handleFileUpload = async (file: File | null) => {
    setUploading(true)
    setError(null)
    setSuccessUrl(null)

    if (!file) {
      setUploading(false)
      return
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.")
      setUploading(false)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB.")
      setUploading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "pdf_upload_preset")

    try {
      const cloudinaryRes = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}`,
        {
          method: "POST",
          body: formData,
        }
      )

      const cloudinaryData = await cloudinaryRes.json()

      if (!cloudinaryRes.ok) {
        throw new Error(cloudinaryData.error?.message || "Upload failed")
      }

      const pdfUrl = cloudinaryData.secure_url
      setSuccessUrl(pdfUrl)

      const ingestRes = await fetch(
        `/api/load-pdf?pdf_url=${encodeURIComponent(pdfUrl)}`
      )

      if (!ingestRes.ok) {
        const errorData = await ingestRes.json()
        throw new Error(
          errorData.error || "Failed to process PDF for chat. Please try again."
        )
      }

      router.push(`/chatbot?pdf_url=${encodeURIComponent(pdfUrl)}`)
    } catch (err: any) {
      console.error("Cloudinary upload error:", err)
      setError(err.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-neutral-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-neutral-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="font-bold text-5xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 text-center tracking-tight">
          RAG PDF Summarizer
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto my-4 text-base text-center">
          Upload your PDF document to start chatting with it instantly. Powered
          by AI for intelligent summarization and Q&A.
        </p>

        <div className="w-full max-w-2xl mt-10">
          <FileUpload onChange={handleFileUpload} />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center h-12">
          {uploading && (
            <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 animate-pulse">
              <div className="w-2 h-2 bg-neutral-600 dark:bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-neutral-600 dark:bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-neutral-600 dark:bg-neutral-400 rounded-full animate-bounce"></div>
              <span className="text-sm font-medium ml-2">
                {successUrl ? "Processing PDF..." : "Uploading..."}
              </span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploadPage
