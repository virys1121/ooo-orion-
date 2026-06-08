"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatInterface({ user, rooms }: { user: any; rooms: any[] }) {
  const [activeRoom, setActiveRoom] = useState(rooms[0] || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    if (!input.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("content", input);
    if (activeRoom.type === "GROUP") {
      formData.append("groupId", activeRoom.id);
    } else {
      formData.append("receiverId", activeRoom.id);
    }

    selectedFiles.forEach(file => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setInput("");
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchMessages();
      }
    } catch (e) {}
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full border-4 border-blue-900 rounded-[3rem] bg-white shadow-2xl p-20 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="text-2xl font-black text-blue-900 uppercase tracking-tighter mb-2">Каналы связи пусты</div>
        <p className="text-gray-500 max-w-sm font-medium">У вас пока нет активных секторов общения. Обратитесь к администратору для привязки к группе.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full border-4 border-blue-900 rounded-[3rem] overflow-hidden bg-white shadow-2xl">
      {/* Sidebar */}
      <div className="w-1/3 border-r-4 border-blue-900 bg-blue-50/30">
        <div className="p-6 border-b-4 border-blue-900 font-black text-blue-900 uppercase text-xs tracking-widest bg-blue-100">
          Секторы связи
        </div>
        <div className="overflow-y-auto h-[calc(100%-76px)]">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`w-full text-left p-6 transition-all duration-200 border-b border-blue-100 ${
                activeRoom?.id === room.id
                ? "bg-blue-900 text-white"
                : "hover:bg-blue-100 text-blue-900"
              }`}
            >
              <div className="font-black uppercase text-sm tracking-tight">{room.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {activeRoom ? (
          <>
            <div className="p-6 border-b-4 border-blue-900 font-black bg-white text-blue-900 uppercase tracking-tight flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              {activeRoom.name}
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.senderId === user.id ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-[10px] font-bold text-blue-900/40 mb-2 px-2 uppercase tracking-widest">
                    {msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div
                    className={`max-w-[80%] px-6 py-4 rounded-[2rem] shadow-md border-2 ${
                      msg.senderId === user.id
                        ? "bg-blue-900 text-white border-blue-900 rounded-tr-none"
                        : "bg-white text-blue-900 border-blue-900/10 rounded-tl-none"
                    }`}
                  >
                    {msg.content && <p>{msg.content}</p>}
                    {msg.media && msg.media.length > 0 && (
                      <div className={`mt-2 pt-2 border-t ${msg.senderId === user.id ? 'border-blue-400/30' : 'border-gray-100'} space-y-2`}>
                        {msg.media.map((item: any) => (
                          <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm underline decoration-dotted hover:opacity-80 transition-opacity"
                          >
                            <span className="mr-2">📎</span>
                            {item.name || "Файл"}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="bg-white border-t">
              {selectedFiles.length > 0 && (
                <div className="px-4 py-2 flex flex-wrap gap-2 text-sm text-blue-600 bg-blue-50">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-blue-200">
                      <span className="max-w-[100px] truncate">{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 font-bold ml-1 hover:text-red-700">×</button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={sendMessage} className="p-4 flex items-center gap-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
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
                  placeholder="Введите сообщение оперативной связи..."
                  className="flex-1 border-2 border-blue-900/10 rounded-2xl p-4 focus:outline-none focus:border-blue-900 transition-all font-medium"
                />
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-8 py-4 rounded-2xl hover:bg-black font-black uppercase text-sm tracking-widest transition-all active:scale-95 shadow-lg"
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
