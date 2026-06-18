import { MessageCircle } from "lucide-react";
import { useTherapistChat } from "../hooks/use-therapist-chat";
import { ChatThreadList } from "../components/Chat-thread-list";
import { ChatWindow } from "../components/Chat-window";
import { useAuthStore, selectAuthSession } from "../../../store/use-auth-store";

export const TherapistChatPage = () => {
  const session = useAuthStore(selectAuthSession);
  const myId = session?.profile.id ?? "";

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

  return (
    <div
      className="h-full p-6 md:p-8"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg-primary)" }}>
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
          className="flex-1 flex rounded-3xl overflow-hidden"
          style={{
            background: "var(--bg-base)",
            border: "1px solid var(--border-default)",
            minHeight: "0",
            height: "calc(100vh - 220px)",
          }}
        >
          {/* Left: thread list */}
          <div
            className="w-72 shrink-0 flex flex-col"
            style={{ borderRight: "1px solid var(--border-default)" }}
          >
            <div
              className="px-4 py-4 shrink-0"
              style={{ borderBottom: "1px solid var(--border-default)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
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
                onSelect={(t) => void selectThread(t)}
                getOtherPartyName={getOtherPartyName}
              />
            )}
          </div>

          {/* Right: chat window or empty state */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedThread ? (
              <ChatWindow
                thread={selectedThread}
                messages={messages}
                messagesLoading={messagesLoading}
                sending={sending}
                myId={myId}
                otherPartyName={getOtherPartyName(selectedThread)}
                onSend={sendMessage}
              />
            ) : (
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