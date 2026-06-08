"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, X, FileText } from "lucide-react";

export default function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    selectedFiles.forEach(file => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
        setSelectedFiles([]);
      }
    } catch (error) {
      alert("Ошибка при публикации");
    } finally {
      setLoading(false);
    }
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

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50/50 p-8 rounded-[2rem] space-y-6 border border-blue-100 shadow-sm">
      <div className="space-y-2">
        <label className="block text-xs font-black text-blue-900 uppercase tracking-widest">Заголовок</label>
        <input
          name="title"
          required
          placeholder="Введите название новости..."
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-black text-blue-900 uppercase tracking-widest">Содержание</label>
        <textarea
          name="content"
          required
          rows={4}
          placeholder="Опишите событие подробно..."
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-xs font-black text-blue-900 uppercase tracking-widest">Прикрепить медиа или документ</label>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition-all group"
          >
            <Paperclip className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Выбрать файлы</span>
          </button>

          <div className="flex flex-wrap gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 bg-blue-100 px-4 py-2 rounded-full text-sm font-bold text-blue-800 border border-blue-200 animate-in fade-in zoom-in duration-200">
                <FileText className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-blue-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-800 disabled:bg-blue-300 transition-all shadow-lg active:scale-[0.98]"
      >
        {loading ? "Публикация..." : "Опубликовать"}
      </button>
    </form>
  );
}
