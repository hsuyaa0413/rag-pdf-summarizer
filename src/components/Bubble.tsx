import { cn } from "@/lib/utils"
import { UIMessage } from "ai"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

const Bubble = ({ message }: { message: UIMessage }) => {
  const { role, parts } = message
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex gap-3 w-full max-w-3xl mx-auto mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
          <Bot size={18} />
        </div>
      )}

      <div
        className={cn(
          "relative px-5 py-3.5 text-sm sm:text-base shadow-sm max-w-[85%]",
          isUser
            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
        )}
      >
        {parts.map((part, index) => {
          if (part.type === "text") {
            return isUser ? (
              <p key={index} className="whitespace-pre-wrap">
                {part.text}
              </p>
            ) : (
              <div
                key={index}
                className="prose prose-sm prose-blue max-w-none text-gray-800 dark:text-gray-200"
              >
                <ReactMarkdown>{part.text}</ReactMarkdown>
              </div>
            )
          }
          return null
        })}
      </div>

      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          <User size={18} />
        </div>
      )}
    </div>
  )
}

export default Bubble
