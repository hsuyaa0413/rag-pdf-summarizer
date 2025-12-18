# RAG PDF Summarizer

An intelligent AI-powered application that allows users to upload PDF documents and interact with them through a chat interface. Built with Next.js, AI SDK, and DataStax Astra DB.

🔗 **Repository**: [https://github.com/hsuyaa0413/rag-pdf-summarizer](https://github.com/hsuyaa0413/rag-pdf-summarizer)

## 🚀 Features

- **📂 PDF Upload & Processing**: Securely upload PDF documents via Cloudinary.
- **🧠 Intelligent Summarization**: Uses RAG (Retrieval-Augmented Generation) to understand and summarize document content.
- **💬 Interactive Chat**: Chat with your PDF using a responsive, AI-powered interface.
- **🎨 Premium UI**: Modern, responsive design with beautiful animations and glassmorphism effects.
- **🌑 Dark Mode Support**: Fully optimized for both light and dark themes.
- **⚡ Real-time Streaming**: Instant AI responses with streaming text generation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **AI & LLM**: [Google Gemini](https://ai.google.dev/) via [AI SDK](https://sdk.vercel.ai/docs)
- **Database**: [DataStax Astra DB](https://www.datastax.com/products/astra) (Vector Search)
- **Storage**: [Cloudinary](https://cloudinary.com/) (File Hosting)
- **Vector Embeddings**: Google Gemini Embedding Model

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ installed
- A DataStax Astra DB account (vector database)
- A Cloudinary account
- A Google Cloud Project with Gemini API enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hsuyaa0413/rag-pdf-summarizer.git
   cd rag-pdf-summarizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following keys:

   ```env
   # DataStax Astra DB
   ASTRA_DB_NAMESPACE=your_namespace
   ASTRA_DB_COLLECTION=your_collection
   ASTRA_DB_API_ENDPOINT=your_api_endpoint
   ASTRA_DB_APPLICATION_TOKEN=your_application_token

   # Google Gemini AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_upload_url
   ```

4. **Initialize the Database**
   Run the seed script to set up your Astra DB collection:

   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Built by [aayushDhungel](https://dhungelaayush.com.np)**
