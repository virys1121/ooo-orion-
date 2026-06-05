"use client";

import { useState } from "react";
import { Moon, X, Send, Calendar } from "lucide-react";

export default function NightStayButton({ parentName, childName, email, groupId }: { parentName: string, childName: string, email: string, groupId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dates, setDates] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dates.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/applications/night-stay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName,
          childName,
          email,
          stayDates: dates,
          groupId,
        }),
      });

      if (res.ok) {
        alert("Заявка на ночное пребывание отправлена.");
        setDates("");
        setIsOpen(false);
      } else {
        alert("Ошибка при отправке заявки.");
      }
    } catch (e) {
      alert("Ошибка сети.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg"
      >
        <Moon className="w-5 h-5" />
        Заявка на ночное пребывание
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-indigo-50">
              <div>
                <h3 className="text-2xl font-black text-indigo-900">Ночное пребывание</h3>
                <p className="text-indigo-600 text-sm font-medium">Выберите даты круглосуточного режима</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-indigo-300 hover:text-indigo-600 transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Желаемые даты
                  </p>
                  <textarea
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    required
                    placeholder="Например: 15 июня - 17 июня"
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-medium placeholder:text-gray-300 min-h-[100px] resize-none"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg shrink-0 h-fit">
                    <Moon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Заявка будет рассмотрена администрацией и воспитателем группы. Вы получите уведомление в личном кабинете.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-300 shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? "Отправка..." : (
                  <>
                    <Send className="w-5 h-5" />
                    Отправить запрос
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
