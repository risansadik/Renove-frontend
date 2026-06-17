import { useAiChat } from "../hooks/use-AI-chat.ts";
import { ChatSidebar } from "./Chat-sidebar.tsx";
import { ChatWindow } from "./Chat-window.tsx";

export const AiCompanion = () => {
  const {
    sessions,
    activeSessionId,
    messages,
    input,
    setInput,
    loadingSessions,
    loadingMessages,
    streaming,
    deletingId,
    bottomRef,
    loadSession,
    handleNewSession,
    handleDeleteSession,
    handleSend,
    handleKeyDown,
  } = useAiChat();

  return (
    <div
      className="flex rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        height: "calc(100vh - 180px)",
        width: "100%",
      }}
    >
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        loadingSessions={loadingSessions}
        deletingId={deletingId}
        onNewSession={handleNewSession}
        onSelectSession={loadSession}
        onDeleteSession={handleDeleteSession}
      />

      <ChatWindow
        messages={messages}
        sessions={sessions}
        activeSessionId={activeSessionId}
        input={input}
        setInput={setInput}
        loadingMessages={loadingMessages}
        streaming={streaming}
        bottomRef={bottomRef}
        onNewSession={handleNewSession}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};