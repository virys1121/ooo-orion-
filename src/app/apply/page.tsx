"use client";

import { useState } from "react";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Ошибка при отправке заявки. Попробуйте еще раз.");
      }
    } catch (error) {
      alert("Произошла ошибка.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Заявка успешно отправлена!</h1>
        <p className="text-xl text-gray-600">Мы свяжемся с вами в ближайшее время по указанной электронной почте.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Заявление на поступление</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО родителей</label>
            <input name="parentName" required className="w-full border rounded-md p-2" placeholder="Иванов Иван Иванович" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО ребенка</label>
            <input name="childName" required className="w-full border rounded-md p-2" placeholder="Иванов Петр Иванович" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Место работы родителей</label>
          <input name="parentWorkplace" required className="w-full border rounded-md p-2" placeholder="Название организации" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Электронная почта</label>
          <input name="email" type="email" required className="w-full border rounded-md p-2" placeholder="example@mail.ru" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пол ребенка</label>
          <select name="childGender" required className="w-full border rounded-md p-2">
            <option value="">Выберите пол</option>
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">О себе и ребенке</label>
          <textarea
            name="about"
            required
            rows={4}
            className="w-full border rounded-md p-2"
            placeholder="Расскажите кратко о вашей семье и особенностях ребенка"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Отправка..." : "Подать заявление"}
        </button>
      </form>
    </div>
  );
}
