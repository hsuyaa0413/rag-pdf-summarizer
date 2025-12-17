import { DataAPIClient } from "@datastax/astra-db-ts"
import "dotenv/config"

type SimilarityMetric = "cosine" | "euclidean" | "dot_product"

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env

// Get the database
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(`${ASTRA_DB_API_ENDPOINT}`, {
  namespace: ASTRA_DB_NAMESPACE,
})

const createCollection = async (
  similarityMetric: SimilarityMetric = "cosine"
) => {
  const res = await db.createCollection(`${ASTRA_DB_COLLECTION}`, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  })

  console.log(res)
}

createCollection()

// const scrapePage = async (url: string) => {
//   const loader = new PuppeteerWebBaseLoader(url, {
//     launchOptions: {
//       headless: true,
//     },
//     gotoOptions: {
//       waitUntil: "domcontentloaded",
//     },
//     evaluate: async (page, browser) => {
//       const result = await page.evaluate(() => document.body.innerHTML)
//       await browser.close()
//       return result
//     },
//   })

//   return (await loader.scrape())?.replace(/<[^>]*>?/gm, "")
// }
