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

      // 2️⃣ Trigger ingestion (call your API route)
      const ingestRes = await fetch(
        `/api/load-pdf?pdf_url=${encodeURIComponent(pdfUrl)}`
      )

      if (!ingestRes.ok) {
        const errorData = await ingestRes.json()
        throw new Error(
          errorData.error || "Failed to process PDF for chat. Please try again."
        )
      }

      // 3️⃣ Only redirect after successful ingestion
      router.push(`/chatbot?pdf_url=${encodeURIComponent(pdfUrl)}`)
    } catch (err: any) {
      console.error("Cloudinary upload error:", err)
      setError(err.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-20 h-full p-4">
      <h1 className="font-bold text-4xl mb-8">RAG PDF Summarizer</h1>
      <div className="w-188 flex items-center justify-center bg-blue-700 p-4 rounded-md">
        <FileUpload onChange={handleFileUpload} />
      </div>

      {uploading && (
        <p className="mt-4 text-blue-700">
          {successUrl ? "Processing PDF for chat..." : "Uploading..."}
        </p>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  )
}

export default FileUploadPage
