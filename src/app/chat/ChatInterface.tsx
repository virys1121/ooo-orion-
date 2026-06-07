"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatInterface({ user, rooms }: { user: any; rooms: any[] }) {
  const [activeRoom, setActiveRoom] = useState(rooms[0] || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeRoom) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeRoom]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  async function fetchMessages() {
    if (!activeRoom) return;
    try {
      const param = activeRoom.type === "GROUP" ? `groupId=${activeRoom.id}` : `receiverId=${activeRoom.id}`;
      const res = await fetch(`/api/chat?${param}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {}
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append("content", input);
    if (activeRoom.type === "GROUP") {
      formData.append("groupId", activeRoom.id);
    } else {
      formData.append("receiverId", activeRoom.id);
    }

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setInput("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchMessages();
      }
    } catch (e) {}
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (rooms.length === 0) {
    return <div className="text-center py-20 text-gray-500">У вас пока нет доступных чатов.</div>;
  }

  return (
    <div className="flex h-full border rounded-xl overflow-hidden bg-white shadow-lg">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b font-semibold text-gray-700">Комнаты</div>
        <div className="overflow-y-auto">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`w-full text-left p-4 hover:bg-gray-100 transition-colors ${
                activeRoom?.id === room.id ? "bg-blue-50 border-r-4 border-blue-500" : ""
              }`}
            >
              <div className="font-medium text-sm">{room.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <>
            <div className="p-4 border-b font-bold bg-white">{activeRoom.name}</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.senderId === user.id ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-[10px] text-gray-400 mb-1 px-2">
                    {msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                      msg.senderId === user.id
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border rounded-tl-none"
                    }`}
                  >
                    {msg.content && <p>{msg.content}</p>}
                    {msg.fileUrl && (
                      <div className="mt-2 pt-2 border-t border-blue-400/30">
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm underline decoration-dotted"
                        >
                          <span className="mr-2">📎</span>
                          {msg.fileName || "Файл"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="bg-white border-t">
              {selectedFile && (
                <div className="px-4 py-2 text-sm text-blue-600 bg-blue-50 flex justify-between items-center">
                  <span>Выбран файл: {selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-red-500 font-bold">×</button>
                </div>
              )}
              <form onSubmit={sendMessage} className="p-4 flex items-center gap-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Прикрепить файл"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напишите сообщение..."
                  className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Отправить
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Выберите чат для начала общения
          </div>
        )}
      </div>
    </div>
  );
}
