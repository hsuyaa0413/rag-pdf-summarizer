import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { GoogleGenAI } from "@google/genai"
import { DataAPIClient } from "@datastax/astra-db-ts"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { NextRequest } from "next/server"

import "dotenv/config"
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_GENERATIVE_AI_API_KEY,
} = process.env

const ai = new GoogleGenAI({ apiKey: GOOGLE_GENERATIVE_AI_API_KEY })

// Get the database
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(`${ASTRA_DB_API_ENDPOINT}`, {
  namespace: ASTRA_DB_NAMESPACE,
})
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
})

export async function GET(request: NextRequest) {
  try {
    const pdfUrl = request.nextUrl.searchParams.get("pdf_url") || ""

    const response = await fetch(pdfUrl.trim())

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PDF: ${response.status} ${response.statusText}`
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    const pdfBlob = new Blob([arrayBuffer], {
      type: "application/pdf",
    })

    const loader = new PDFLoader(pdfBlob)
    const docs = await loader.load()

    const fullText = docs.map(doc => doc.pageContent).join(" ")

    const cleanedText = fullText
      .replace(/[^a-zA-Z0-9\s]/g, " ") // Replace non-alphanumeric (except whitespace) with space
      .replace(/\s+/g, " ") // Collapse multiple whitespace (including \n, \t) into single space
      .trim() // Remove leading/trailing spaces

    if (!cleanedText) {
      return Response.json(
        { error: "No valid text found in PDF" },
        { status: 400 }
      )
    }

    const chunks = await splitter.splitText(cleanedText)
    const collection = db.collection(`${ASTRA_DB_COLLECTION}`)

    for (const chunk of chunks) {
      if (!chunk.trim()) continue

      const embeddedContents = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk,
        config: {
          outputDimensionality: 768,
        },
      })

      const vector = embeddedContents.embeddings?.[0]?.values

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      })
      console.log(res)
    }
    return Response.json({
      message: "PDF processed and vectorized successfully",
      chunkCount: chunks.length,
    })
  } catch (error) {
    console.error("Error processing PDF:", error)
    return Response.json({ error: "Failed to process PDF" }, { status: 500 })
  }
}
