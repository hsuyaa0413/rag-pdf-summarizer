import { Bot } from "lucide-react"

const LoadingBubble = () => {
  return (
    <div className="flex gap-3 w-full max-w-3xl mx-auto mb-6 justify-start animate-pulse">
      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
        <Bot size={18} />
      </div>
      <div className="relative px-5 py-4 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}

export default LoadingBubble
