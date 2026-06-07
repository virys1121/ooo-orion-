"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, User, MapPin, Mail, MessageSquare, CheckCircle2, ClipboardList, Paperclip, X } from "lucide-react";

export default function ApplyPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    childAge: "",
    phone: "",
    workplace: "",
    email: "",
    about: "",
    gender: "male",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (selectedFile) {
      data.append("file", selectedFile);
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: data,
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-lg border-2 border-green-100"
        >
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-blue-900 mb-4">Заявка принята!</h2>
          <p className="text-gray-600 text-lg">Мы свяжемся с вами по указанной электронной почте в ближайшее время после проверки данных службой безопасности.</p>
          <button onClick={() => setStatus("idle")} className="mt-8 btn-primary">Подать еще одну</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="bg-blue-900 p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-black mb-4">Подача заявления</h1>
              <p className="text-blue-100 text-lg">Заполните форму для рассмотрения кандидатуры вашего ребенка на поступление в АНО ЦДО «ОРИОН».</p>
            </div>
            <ShieldIcon className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>ФИО Родителя</span>
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="Иванов Иван Иванович"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>ФИО Ребенка</span>
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="Иванов Петр Иванович"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                  <span>Возраст ребенка</span>
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="Например: 5 лет"
                  value={formData.childAge}
                  onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Место работы</span>
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="Название организации"
                  value={formData.workplace}
                  onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Электронная почта</span>
                </label>
                <input
                  required
                  type="email"
                  className="input-field"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>Номер телефона</span>
                </label>
                <input
                  required
                  type="tel"
                  className="input-field"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-bold text-blue-900 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>О себе и ребенке</span>
              </label>
              <textarea
                required
                rows={4}
                className="input-field resize-none"
                placeholder="Расскажите о достижениях, особенностях или пожеланиях..."
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-blue-900 uppercase tracking-wider">Пол ребенка</label>
                <div className="flex space-x-6">
                  {["male", "female"].map((g) => (
                    <label key={g} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-5 h-5 text-blue-900 border-gray-300 focus:ring-blue-900"
                      />
                      <span className="text-lg font-medium text-gray-700 group-hover:text-blue-900 transition-colors">
                        {g === "male" ? "Мужской" : "Женский"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-blue-900 uppercase tracking-wider">Прикрепить документы</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                    <span>{selectedFile ? "Изменить файл" : "Выбрать файл"}</span>
                  </button>
                  {selectedFile && (
                    <div className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full text-sm text-blue-800">
                      <span className="max-w-[150px] truncate">{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)} className="text-blue-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full btn-primary py-5 text-xl flex items-center justify-center space-x-3 group disabled:opacity-50"
            >
              <span>{status === "loading" ? "Отправка..." : "Отправить заявление"}</span>
              <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  );
}
