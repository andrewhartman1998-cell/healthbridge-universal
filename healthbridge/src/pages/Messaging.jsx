import { useState, useEffect, useRef } from "react";
import { Message } from "@/api/entities";
import { User } from "@/api/entities";

export default function Messaging({ currentUser }) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [composing, setComposing] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadThreads();
    if (currentUser?.role === "patient") loadDoctors();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadThreads = async () => {
    setLoading(true);
    try {
      const all = await Message.filter({ recipient_id: currentUser?.id });
      const sent = await Message.filter({ sender_id: currentUser?.id });
      const combined = [...all, ...sent];

      // Group into threads
      const threadMap = {};
      combined.forEach(msg => {
        const tid = msg.thread_id || msg.id;
        if (!threadMap[tid]) threadMap[tid] = [];
        threadMap[tid].push(msg);
      });

      // Sort threads by latest message
      const threadList = Object.entries(threadMap).map(([tid, msgs]) => {
        const sorted = msgs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        const latest = sorted[0];
        const unread = msgs.filter(m => m.recipient_id === currentUser?.id && !m.is_read).length;
        const otherPerson = latest.sender_id === currentUser?.id
          ? { name: latest.recipient_name, role: latest.recipient_role }
          : { name: latest.sender_name, role: latest.sender_role };
        return { thread_id: tid, latest, msgs: sorted, unread, otherPerson, subject: latest.subject };
      }).sort((a, b) => new Date(b.latest.created_date) - new Date(a.latest.created_date));

      setThreads(threadList);
      setUnreadCount(threadList.reduce((sum, t) => sum + t.unread, 0));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadDoctors = async () => {
    try {
      const users = await User.filter({ role: "doctor" });
      setDoctors(users);
    } catch (e) {}
  };

  const openThread = async (thread) => {
    setSelectedThread(thread);
    setComposing(false);
    const sorted = [...thread.msgs].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    setMessages(sorted);

    // Mark unread messages as read
    for (const msg of sorted) {
      if (msg.recipient_id === currentUser?.id && !msg.is_read) {
        await Message.update(msg.id, { is_read: true, status: "read" });
      }
    }
    await loadThreads();
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      let recipient = selectedThread
        ? { id: selectedThread.otherPerson.id || selectedThread.latest.sender_id === currentUser?.id
            ? selectedThread.latest.recipient_id : selectedThread.latest.sender_id,
            name: selectedThread.otherPerson.name, role: selectedThread.otherPerson.role }
        : selectedRecipient;

      const threadId = selectedThread?.thread_id || `thread_${Date.now()}`;

      await Message.create({
        sender_id: currentUser?.id,
        sender_name: currentUser?.full_name || currentUser?.email,
        sender_role: currentUser?.role,
        recipient_id: recipient?.id || "",
        recipient_name: recipient?.name || "",
        recipient_role: recipient?.role || "doctor",
        subject: selectedThread ? selectedThread.subject : newSubject,
        body: newMessage.trim(),
        thread_id: threadId,
        is_read: false,
        status: "sent"
      });

      setNewMessage("");
      setNewSubject("");
      setSelectedRecipient(null);
      setComposing(false);
      await loadThreads();

      // Reload thread if open
      if (selectedThread) {
        const updated = await Message.filter({ thread_id: threadId });
        const sorted = updated.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        setMessages(sorted);
      }
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const roleColor = (role) => {
    if (role === "doctor") return "bg-blue-100 text-blue-800";
    if (role === "admin") return "bg-purple-100 text-purple-800";
    return "bg-green-100 text-green-800";
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    return d.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{height: "calc(100vh - 64px)"}}>
      {/* Sidebar — Thread List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            {unreadCount > 0 && (
              <span className="text-sm text-blue-600 font-medium">{unreadCount} unread</span>
            )}
          </div>
          <button
            onClick={() => { setComposing(true); setSelectedThread(null); setMessages([]); }}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
          >
            ✏️ New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading...</div>
          ) : threads.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start a conversation with your care team</p>
            </div>
          ) : (
            threads.map(thread => (
              <div
                key={thread.thread_id}
                onClick={() => openThread(thread)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedThread?.thread_id === thread.thread_id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor(thread.otherPerson.role)}`}>
                        {thread.otherPerson.role}
                      </span>
                      {thread.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${thread.unread > 0 ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                      {thread.otherPerson.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{thread.subject}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{thread.latest.body}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap mt-1">
                    {formatTime(thread.latest.created_date)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col">
        {composing ? (
          <div className="flex-1 flex flex-col p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col max-w-2xl mx-auto w-full">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">New Message</h3>
              </div>
              <div className="p-5 space-y-4 flex-1 flex flex-col">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedRecipient?.id || ""}
                    onChange={e => {
                      const doc = doctors.find(d => d.id === e.target.value);
                      setSelectedRecipient(doc ? { id: doc.id, name: doc.full_name, role: "doctor" } : null);
                    }}
                  >
                    <option value="">Select a doctor...</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.full_name} — {d.role}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Question about my appointment"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                  />
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Write your message here..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setComposing(false)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim() || !selectedRecipient}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {sending ? "Sending..." : "📤 Send Message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : selectedThread ? (
          <div className="flex-1 flex flex-col">
            {/* Thread header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${roleColor(selectedThread.otherPerson.role)}`}>
                {selectedThread.otherPerson.role}
              </div>
              <div>
                <p className="font-bold text-gray-900">{selectedThread.otherPerson.name}</p>
                <p className="text-sm text-gray-500">{selectedThread.subject}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(msg => {
                const isMe = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-lg ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      {!isMe && (
                        <span className="text-xs text-gray-500 mb-1 px-1">{msg.sender_name}</span>
                      )}
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                      }`}>
                        {msg.body}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 px-1">{formatTime(msg.created_date)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply box */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3 items-end">
                <textarea
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write a reply..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  rows={2}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
                >
                  {sending ? "..." : "Send"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 px-1">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Your Messages</h3>
              <p className="text-gray-500 mb-6 max-w-sm">Securely communicate with your care team. All messages are private and HIPAA-compliant.</p>
              <button
                onClick={() => setComposing(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
              >
                ✏️ Start a Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
