"use client"

import { DefaultChatTransport } from "ai"
import Bubble from "./Bubble"
import LoadingBubble from "./LoadingBubble"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useChat } from "@ai-sdk/react"
import { useState } from "react"

const Chatbot = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })
  const [input, setInput] = useState("")

  const noMessages = !messages || messages.length === 0

  return (
    <main>
      <section className="h-[74vh] flex flex-col justify-between">
        {noMessages ? (
          <div>
            <p>👋 Welcome! Your PDF has been successfully uploaded.</p>
            <br />
            I'm ready to help you explore and summarize your document. You can
            ask me things like:
            <ul className="list-disc list-inside">
              <li>"Give me a summary of this PDF"</li>
              <li>"Explain this document in simple words"</li>
              <li>"What are the key points from page 5?"</li>
              <li>"Find mentions of a specific topic"</li>
            </ul>
            <br />
            <p>👉 Go ahead and type your question or prompt to get started.</p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <Bubble key={message.id} message={message} />
            ))}

            {status === "streaming" && <LoadingBubble />}
          </>
        )}

        <form
          onSubmit={e => {
            e.preventDefault()
            if (input.trim()) {
              sendMessage({ text: input })
              setInput("")
            }
          }}
          className="flex items-center justify-center gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="bg-white focus-visible:ring-blue-700 focus-visible:ring-[1.5px]"
          />
          <Button
            type="submit"
            disabled={status !== "ready"}
            className="bg-blue-700 hover:bg-blue-800"
          >
            Submit
          </Button>
        </form>
      </section>
    </main>
  )
}

export default Chatbot
