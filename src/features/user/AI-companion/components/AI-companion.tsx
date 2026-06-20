import { useState } from "react";
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

  const [mobilePanel, setMobilePanel] = useState<"sidebar" | "chat">("sidebar");

  const handleSelectSession = async (id: string): Promise<void> => {
    await loadSession(id);
    setMobilePanel("chat");
  };

  const handleNewSessionMobile = async (): Promise<void> => {
    await handleNewSession();
    setMobilePanel("chat");
  };

  return (
    <div
      className="flex overflow-hidden rounded-2xl"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        height: "calc(100vh - 220px)",
        minHeight: "480px",
        width: "100%",
      }}
    >
      {/* Sidebar — full-width on mobile, fixed 240px on desktop */}
      <div
        className={`
          shrink-0 flex flex-col
          ${mobilePanel === "sidebar" ? "flex" : "hidden"}
          md:flex w-full md:w-60
        `}
        style={{ borderRight: "1px solid var(--border-default)" }}
      >
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          loadingSessions={loadingSessions}
          deletingId={deletingId}
          onNewSession={handleNewSessionMobile}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Chat window — full-width on mobile, flex-1 on desktop */}
      <div
        className={`
          flex-col min-w-0 flex-1
          ${mobilePanel === "chat" ? "flex" : "hidden"}
          md:flex
        `}
      >
        <ChatWindow
          messages={messages}
          sessions={sessions}
          activeSessionId={activeSessionId}
          input={input}
          setInput={setInput}
          loadingMessages={loadingMessages}
          streaming={streaming}
          bottomRef={bottomRef}
          onNewSession={handleNewSessionMobile}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          onBack={(): void => setMobilePanel("sidebar")}
        />
      </div>
    </div>
  );
};