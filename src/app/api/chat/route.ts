import { DataAPIClient } from "@datastax/astra-db-ts"
import { GoogleGenAI } from "@google/genai"

import { google } from "@ai-sdk/google"
import { convertToModelMessages, generateText, streamText, UIMessage } from "ai"

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

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json()
    const latestMessage = messages[messages.length - 1]

    let docContext = ""

    const embeddedContents = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: latestMessage.parts.join(" "),
      config: {
        outputDimensionality: 768,
      },
    })

    try {
      const collection = db.collection(`${ASTRA_DB_COLLECTION}`)

      const vector = embeddedContents.embeddings?.[0]?.values
      if (!vector || vector.length === 0) {
        throw new Error("Failed to generate embedding vector.")
      }

      const cursor = collection.find(
        {},
        {
          sort: {
            $vector: vector,
          },
          limit: 10,
        }
      )

      const documents = await cursor.toArray()
      const contexts = documents?.map(doc => doc.text)

      docContext = contexts?.join("\n---\n")
    } catch (error) {
      console.error("Error querying db:", error)
      docContext = ""
    }

    const systemPrompt = `You are an AI assistant that answers questions strictly based on the provided document context.

Document Context:
-----------------
${docContext}
-----------------

User Question:
${latestMessage.parts.join(" ")}

Instructions:
- Use ONLY the information from the document context.
- If the answer is not present in the context, clearly say: 
  "I couldn't find this information in the uploaded document."
- Keep the response clear, concise, and easy to understand.
- If helpful, use bullet points or short paragraphs.
- Do NOT make assumptions or add external knowledge.
`

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
    })

    // const { text } = await generateText({
    //   model: google("gemini-2.5-flash"),
    //   prompt: systemPrompt,
    // })

    console.log(result)

    return new Response(
      JSON.stringify({ text: result.toUIMessageStreamResponse() })
    )
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response(
      JSON.stringify({ text: "An internal server error occurred." }),
      { status: 500 }
    )
  }
}
