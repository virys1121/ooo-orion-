"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatInterface({ user, rooms }: { user: any; rooms: any[] }) {
  const [activeRoom, setActiveRoom] = useState(rooms[0] || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRoom) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeRoom]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!input.trim() || !activeRoom) return;

    const body: any = { content: input };
    if (activeRoom.type === "GROUP") {
      body.groupId = activeRoom.id;
    } else {
      body.receiverId = activeRoom.id;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setInput("");
        fetchMessages();
      }
    } catch (e) {}
  }

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
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t flex bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 font-semibold"
              >
                Отправить
              </button>
            </form>
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
