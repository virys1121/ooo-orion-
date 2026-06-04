"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      alert("Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 p-6 rounded-xl space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Заголовок</label>
        <input name="title" required className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Содержание</label>
        <textarea name="content" required rows={4} className="w-full border rounded p-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ссылка на медиа (фото/видео)</label>
          <input name="mediaUrl" placeholder="https://..." className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Тип медиа</label>
          <select name="mediaType" className="w-full border rounded p-2">
            <option value="">Без медиа</option>
            <option value="IMAGE">Фото</option>
            <option value="VIDEO">Видео</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300"
      >
        Опубликовать
      </button>
    </form>
  );
}
