import { type ChatMessage, type ChatSession } from "../../../../services/api/chat.service.ts";

export interface ChatSidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    loadingSessions: boolean;
    deletingId: string | null;
    onNewSession: () => Promise<void>;
    onSelectSession: (id: string) => Promise<void>;
    onDeleteSession: (id: string) => Promise<void>;
}


export interface ChatWindowProps {
    messages: ChatMessage[];
    sessions: ChatSession[];
    activeSessionId: string | null;
    input: string;
    setInput: (val: string) => void;
    loadingMessages: boolean;
    streaming: boolean;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    onNewSession: () => Promise<void>;
    onSend: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}