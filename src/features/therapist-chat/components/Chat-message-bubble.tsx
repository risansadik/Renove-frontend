import { format } from "date-fns";
import type { ChatMessageBubbleProps } from "../types/therapist-chat.types";

export const ChatMessageBubble = ({ message, isMine }: ChatMessageBubbleProps) => {
  const time = message.createdAt
    ? format(new Date(message.createdAt), "hh:mm a")
    : "";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[72%] px-4 py-2.5 rounded-2xl"
        style={
          isMine
            ? {
                background: "var(--accent-primary)",
                color: "#fff",
                borderBottomRightRadius: "6px",
              }
            : {
                background: "var(--bg-subtle)",
                color: "var(--fg-primary)",
                border: "1px solid var(--border-default)",
                borderBottomLeftRadius: "6px",
              }
        }
      >
        <p className="text-sm leading-relaxed wrap-break-word">{message.content}</p>
        {time && (
          <p
            className="text-[10px] mt-1 text-right"
            style={{ color: isMine ? "rgba(255,255,255,0.65)" : "var(--fg-muted)" }}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
};