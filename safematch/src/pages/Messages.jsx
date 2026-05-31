import { useState, useEffect, useRef } from "react";
import { SafeMatchMessage } from "@/api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const BANNED_KEYWORDS = ["kill", "hurt", "threat", "die", "naked", "nude", "sex", "address", "where do you live", "come over"];

function moderateMessage(text) {
  const lower = text.toLowerCase();
  return BANNED_KEYWORDS.some(k => lower.includes(k));
}

export default function Messages({ currentUser }) {
  const { t } = useLanguage();
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const messagesEnd = useRef();

  useEffect(() => { loadThreads(); }, []);
  useEffect(() => { if (activeThread) loadMessages(activeThread); }, [activeThread]);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadThreads = async () => {
    setLoading(true);
    try {
      const sent = await SafeMatchMessage.filter({ sender_id: currentUser?.id });
      const recv = await SafeMatchMessage.filter({ recipient_id: currentUser?.id });
      const all = [...sent, ...recv];
      const threadMap = {};
      all.forEach(m => {
        if (!threadMap[m.thread_id]) threadMap[m.thread_id] = { id: m.thread_id, name: m.sender_id === currentUser?.id ? m.recipient_name : m.sender_name, last: m.body, unread: !m.is_read && m.recipient_id === currentUser?.id };
      });
      setThreads(Object.values(threadMap));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadMessages = async (threadId) => {
    try {
      const msgs = await SafeMatchMessage.filter({ thread_id: threadId });
      const approved = msgs.filter(m => m.moderation_status !== "blocked");
      setMessages(approved.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
    } catch (e) { console.error(e); }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeThread) return;
    if (moderateMessage(newMsg)) {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 4000);
      setNewMsg("");
      return;
    }
    const thread = threads.find(t => t.id === activeThread);
    try {
      await SafeMatchMessage.create({
        sender_id: currentUser?.id,
        sender_name: currentUser?.full_name || currentUser?.email,
        recipient_name: thread?.name || "Member",
        thread_id: activeThread,
        body: newMsg,
        moderation_status: "approved",
        is_read: false,
        is_deleted: false,
      });
      setNewMsg("");
      loadMessages(activeThread);
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Thread list */}
      <div className={`${activeThread ? "hidden md:flex" : "flex"} flex-col w-full md:w-72 border-r border-gray-100 bg-white`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">{t("messages")}</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm px-4">
              <div className="text-4xl mb-3">💬</div>
              <p>{t("noMessages")}</p>
              <p className="mt-1 text-xs">Match with someone to start chatting.</p>
            </div>
          ) : threads.map(thread => (
            <button key={thread.id} onClick={() => setActiveThread(thread.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-left transition-colors ${activeThread === thread.id ? "bg-purple-50" : ""}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0">
                {thread.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{thread.name}</p>
                <p className="text-gray-400 text-xs truncate">{thread.last}</p>
              </div>
              {thread.unread && <div className="w-2 h-2 bg-purple-600 rounded-full shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Message view */}
      {activeThread ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            <button onClick={() => setActiveThread(null)} className="md:hidden text-gray-400 hover:text-gray-600 mr-1">←</button>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {threads.find(t => t.id === activeThread)?.name?.[0]?.toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800">{threads.find(t => t.id === activeThread)?.name}</span>
            <div className="ml-auto flex gap-3">
              <button className="text-xs text-gray-400 hover:text-red-500">🚩 {t("report")}</button>
              <button className="text-xs text-gray-400 hover:text-red-500">🚫 {t("block")}</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <div className="bg-purple-50 border border-purple-100 rounded-xl px-3 py-2 text-center text-xs text-purple-600 mb-4">
              🛡️ Messages in SafeMatch are moderated for your protection.
            </div>
            {messages.map(msg => {
              const isMine = msg.sender_id === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${isMine ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm" : "bg-white text-gray-800 shadow-sm rounded-bl-sm"}`}>
                    {msg.body}
                    {msg.moderation_status === "flagged" && <span className="block text-xs opacity-60 mt-1">⚠️ Under review</span>}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEnd} />
          </div>

          {/* Blocked warning */}
          {blocked && (
            <div className="mx-4 mb-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-xl text-center">
              ⚠️ That message was blocked by our safety filter. Please keep conversations respectful.
            </div>
          )}

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-3 items-end">
            <textarea rows={1} value={newMsg} onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
              placeholder={t("typeMessage")}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <button onClick={sendMessage} disabled={!newMsg.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity">
              {t("send")}
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 text-center text-gray-400">
          <div>
            <div className="text-5xl mb-3">💬</div>
            <p className="font-medium">Select a conversation</p>
            <p className="text-sm mt-1">All messages are protected by SafeMatch moderation.</p>
          </div>
        </div>
      )}
    </div>
  );
}
