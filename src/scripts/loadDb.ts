import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer"
import { GoogleGenAI } from "@google/genai"

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

import "dotenv/config"

type SimilarityMetric = "cosine" | "euclidean" | "dot_product"

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

const data = ["a", "b", "c"] // Placeholder for actual data loading logic

// Get the database
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(`${ASTRA_DB_API_ENDPOINT}`, {
  namespace: ASTRA_DB_NAMESPACE,
})

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
})

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(`${ASTRA_DB_COLLECTION}`, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  })

  console.log(res)
}

const loadSampleData = async () => {
  const collection = db.collection(`${ASTRA_DB_COLLECTION}`)

  for await (const url of data) {
    const content = await scrapePage(url)
    const chunks = await splitter.splitText(content)

    for await (const chunk of chunks) {
      const embeddedContents = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk,
        config: {
          outputDimensionality: 768,
        },
      })

      const vector = embeddedContents.embeddings?.values

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      })
      console.log(res)
    }
  }
}

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML)
      await browser.close()
      return result
    },
  })

  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "")
}

// createCollection().then(() => loadSampleData())
