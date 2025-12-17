import { UIMessage } from "ai"

const Bubble = ({ message }: { message: UIMessage }) => {
  const { role, parts } = message

  return (
    <div
      key={message.id}
      className={`${
        role === "user"
          ? "text-right bg-blue-700 text-white py-4 px-3 rounded-l-lg rounded-tr-lg w-fit right-0"
          : "text-left bg-white text-blue-700 py-4 px-3 rounded-r-lg rounded-tl-lg w-fit left-0"
      } my-2`}
    >
      {role === "user" ? "You: " : "AI: "}
      {parts.map((part, index) =>
        part.type === "text" ? <span key={index}>{part.text}</span> : null
      )}
    </div>
  )
}

export default Bubble
