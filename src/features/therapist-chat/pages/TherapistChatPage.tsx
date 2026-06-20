import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useTherapistChat } from "../hooks/use-therapist-chat";
import { ChatThreadList } from "../components/Chat-thread-list";
import { ChatWindow } from "../components/Chat-window";
import { useAuthStore, selectAuthSession } from "../../../store/use-auth-store";

export const TherapistChatPage = () => {
  const session = useAuthStore(selectAuthSession);
  const myId = session?.profile.id ?? "";

  const [mobilePanel, setMobilePanel] = useState<"list" | "chat">("list");

  const {
    threads,
    threadsLoading,
    selectedThread,
    messages,
    messagesLoading,
    sending,
    selectThread,
    sendMessage,
    getOtherPartyName,
  } = useTherapistChat();

const handleSelectThread = async (thread: Parameters<typeof selectThread>[0]) => {
    await selectThread(thread);
    setMobilePanel("chat");
  };

  const handleBack = () => {
    setMobilePanel("list");
  };

  return (
    <div
      className="h-full md:p-6 lg:p-8"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col md:gap-6">

        {/* Page heading — hidden on mobile when chat is open */}
        <div
          className={`px-4 pt-4 md:px-0 md:pt-0 shrink-0 ${
            mobilePanel === "chat" ? "hidden md:block" : "block"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--fg-primary)" }}>
            Messages
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
            Chats with{" "}
            {session?.role === "therapist" ? "your clients" : "your therapists"} after
            completed sessions.
          </p>
        </div>

        {/* Chat shell */}
        <div
          className="flex-1 flex overflow-hidden md:rounded-3xl"
          style={{
            background: "var(--bg-base)",
            border: "1px solid var(--border-default)",
            minHeight: "0",
            // On desktop use fixed height; on mobile fill remaining viewport
            height: "calc(100vh - 220px)",
          }}
        >
          {/* ── LEFT: Thread list ─────────────────────────────────────── */}
          {/*
            Mobile:  full-width, shown only when mobilePanel === "list"
            Desktop: fixed 288px sidebar, always visible
          */}
          <div
            className={`
              flex flex-col shrink-0
              ${mobilePanel === "list" ? "flex" : "hidden"}
              md:flex w-full md:w-72
            `}
            style={{ borderRight: "1px solid var(--border-default)" }}
          >
            {/* Sidebar header */}
            <div
              className="px-4 py-4 shrink-0"
              style={{ borderBottom: "1px solid var(--border-default)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--fg-muted)" }}
              >
                Conversations
              </p>
            </div>

            {threadsLoading ? (
              <div className="flex items-center justify-center flex-1">
                <div className="flex flex-col items-center gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-56 h-14 rounded-xl animate-pulse"
                      style={{ background: "var(--bg-subtle)" }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <ChatThreadList
                threads={threads}
                selectedThreadId={selectedThread?.id}
                onSelect={(t) => void handleSelectThread(t)}
                getOtherPartyName={getOtherPartyName}
              />
            )}
          </div>

          {/* ── RIGHT: Chat window ────────────────────────────────────── */}
          {/*
            Mobile:  full-width, shown only when mobilePanel === "chat"
            Desktop: flex-1, always visible
          */}
          <div
            className={`
              flex-col min-w-0 flex-1
              ${mobilePanel === "chat" ? "flex" : "hidden"}
              md:flex
            `}
          >
            {selectedThread ? (
              <ChatWindow
                thread={selectedThread}
                messages={messages}
                messagesLoading={messagesLoading}
                sending={sending}
                myId={myId}
                otherPartyName={getOtherPartyName(selectedThread)}
                onSend={sendMessage}
                onBack={handleBack}
              />
            ) : (
              /* Empty state — only visible on desktop when nothing is selected */
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--accent-glow)" }}
                >
                  <MessageCircle size={28} style={{ color: "var(--accent-primary)" }} />
                </div>
                <div>
                  <p className="text-base font-semibold" style={{ color: "var(--fg-primary)" }}>
                    Select a conversation
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
                    Choose a chat from the list on the left to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};