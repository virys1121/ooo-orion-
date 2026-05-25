"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserForm({ groups }: { groups: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
        alert("Пользователь создан");
      } else {
        const err = await res.json();
        alert("Ошибка: " + err.error);
      }
    } catch (error) {
      alert("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">ФИО</label>
        <input name="name" required className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" required className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Пароль</label>
        <input name="password" type="password" required className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Роль</label>
        <select name="role" required className="w-full border rounded p-2">
          <option value="PARENT">Родитель</option>
          <option value="TEACHER">Учитель</option>
          <option value="ADMIN">Админ</option>
        </select>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-semibold mb-2 text-sm">Информация о ребенке (для родителей)</h3>
        <div className="space-y-2">
          <input name="childName" className="w-full border rounded p-2" placeholder="ФИО ребенка" />
          <select name="childGender" className="w-full border rounded p-2">
            <option value="">Пол ребенка</option>
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
          </select>
          <input name="groupName" className="w-full border rounded p-2" placeholder="Название группы" />
          <textarea name="schedule" className="w-full border rounded p-2" placeholder="Расписание ребенка (необязательно)" rows={3} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? "Создание..." : "Создать пользователя"}
      </button>
    </form>
  );
}
