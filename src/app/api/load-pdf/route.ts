import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

export async function GET() {
  const response = await fetch(
    "https://res.cloudinary.com/delchtyqv/image/upload/v1733686722/zg8nvapfro9dlramraid.pdf"
  )

  const arrayBuffer = await response.arrayBuffer()

  const pdfBlob = new Blob([arrayBuffer], {
    type: "application/pdf",
  })

  const loader = new PDFLoader(pdfBlob)
  const docs = await loader.load()

  return Response.json({ content: docs[0].pageContent })
}
