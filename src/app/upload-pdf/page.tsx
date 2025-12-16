"use client"

import { FileUpload } from "@/components/ui/file-upload"
import { useState } from "react"

const FileUploadPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const handleFileUpload = (file: File | null) => {
    setFile(file)
    console.log(file)
  }

  return (
    <div className="flex flex-col items-center mt-20 h-full p-4">
      <h1 className="font-bold text-4xl mb-8">RAG PDF Summarizer</h1>
      <div className="w-188 flex items-center justify-center bg-blue-700 p-4 rounded-md">
        <FileUpload onChange={handleFileUpload} />
      </div>
    </div>
  )
}

export default FileUploadPage
