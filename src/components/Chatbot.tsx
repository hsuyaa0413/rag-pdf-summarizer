"use client"

import { DefaultChatTransport } from "ai"
import Bubble from "./Bubble"
import LoadingBubble from "./LoadingBubble"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  Sparkles,
  MessageSquareText,
  Search,
  FileText,
} from "lucide-react"

const Chatbot = () => {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, status])

  const noMessages = !messages || messages.length === 0

  const handleSend = () => {
    if (input.trim()) {
      sendMessage({
        parts: [{ type: "text", text: input }],
      })
      setInput("")
    }
  }

  return (
    <main className="flex flex-col h-[600px] lg:h-[80vh] max-w-5xl mx-auto rounded-2xl shadow-xl overflow-hidden ">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg">PDF Assistant</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online & Ready
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
        {noMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6 animate-[fadeIn_0.5s_ease-out_forwards] ">
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-2 hover:rotate-3 transition-transform">
              <FileText size={40} />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
              <p className="text-gray-500">
                I'm ready to help you explore and summarize your document. Just
                ask away!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8">
              {[
                { icon: FileText, text: "Give me a summary of this PDF" },
                {
                  icon: MessageSquareText,
                  text: "Explain this document in simple words",
                },
                { icon: Sparkles, text: "What are the key points?" },
                { icon: Search, text: "Find mentions of specific topics" },
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(suggestion.text)
                    // Optional: auto-send
                    // sendMessage({ parts: [{ type: "text", text: suggestion.text }]})
                  }}
                  className="p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left flex items-start gap-3 group cursor-pointer"
                >
                  <suggestion.icon
                    size={18}
                    className="text-blue-500 mt-0.5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-blue-700">
                    {suggestion.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map(message => (
              <Bubble key={message.id} message={message} />
            ))}

            {status === "streaming" && <LoadingBubble />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSend()
          }}
          className="max-w-3xl mx-auto flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-gray-700 placeholder:text-gray-400 min-h-[44px] py-3 px-4 resize-none"
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            size="icon"
            className="rounded-xl h-10 w-10 mb-0.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
          >
            <Send size={18} />
          </Button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400">
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </main>
  )
}

export default Chatbot
