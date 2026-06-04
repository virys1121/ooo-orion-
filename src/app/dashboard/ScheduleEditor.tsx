"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScheduleEditor({ childId, initialSchedule }: { childId: string, initialSchedule: string | null }) {
  const [schedule, setSchedule] = useState(initialSchedule || "");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, schedule }),
      });

      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert("Ошибка при сохранении");
      }
    } catch (error) {
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-500 mb-1">Расписание:</p>
        <div className="p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap min-h-[40px]">
          {schedule || "Не заполнено"}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
        >
          Редактировать
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-semibold text-gray-500">Редактирование расписания:</p>
      <textarea
        value={schedule}
        onChange={(e) => setSchedule(e.target.value)}
        className="w-full border rounded p-2 text-sm"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
