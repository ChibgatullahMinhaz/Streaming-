/**
 * Chat Panel Component
 * 
 * Real-time chat using Firebase Firestore.
 * Messages are stored in Firestore under: chats/{roomId}/messages/{messageId}
 * 
 * Features:
 * - Real-time message updates via Firestore onSnapshot
 * - Auto-scroll to latest message
 * - Role badges for moderators/broadcasters
 */

import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import RoleBadge from "@/components/RoleBadge";

interface ChatMessage {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  role: string;
  createdAt: any;
}

interface ChatPanelProps {
  roomId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ roomId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time chat messages from Firestore
  useEffect(() => {
    if (!roomId) return;

    const messagesRef = collection(db, "chats", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"), limit(200));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      setMessages(msgs);
    });

    return unsubscribe;
  }, [roomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      const messagesRef = collection(db, "chats", roomId, "messages");
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        role: user.role,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">Chat</h3>
        <span className="text-xs text-muted-foreground ml-auto">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Be the first to chat!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-fade-in ${msg.uid === user?.uid ? "text-right" : ""}`}
          >
            <div
              className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                msg.uid === user?.uid
                  ? "gradient-brand text-primary-foreground rounded-br-sm"
                  : "bg-secondary text-secondary-foreground rounded-bl-sm"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-semibold text-xs">{msg.displayName}</span>
                <RoleBadge role={msg.role as any} small />
              </div>
              <p className="break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-secondary border-border text-sm"
          maxLength={500}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim() || sending}
          className="gradient-brand text-primary-foreground shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;
