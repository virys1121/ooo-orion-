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
