"use client";

import { useState } from "react";
import { X, Calendar, User, Mail, Phone, Briefcase, FileText, Paperclip, Download } from "lucide-react";

export default function ApplicationModal({ app, onClose }: { app: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Детали заявления</h2>
            <p className="text-blue-200 text-sm">ID: {app.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh]">
          {/* Main Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-2">Заявитель</label>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{app.parentName}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Mail className="w-4 h-4" /> {app.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <Phone className="w-4 h-4" /> {app.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-2">Место работы</label>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <p className="font-bold text-gray-700">{app.parentWorkplace}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-2">Ребенок</label>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="font-black text-xl text-blue-900">{app.childName}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                      {app.childGender === 'MALE' ? '👦 Мужской' : '👧 Женский'}
                    </span>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                      🎂 {app.childAge}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-2">Дата подачи</label>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <p className="font-medium">{new Date(app.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* Detailed Text */}
          <div>
            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-3">О себе и ребенке</label>
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 italic text-gray-700 leading-relaxed">
              "{app.about}"
            </div>
          </div>

          {/* Attached Files */}
          <div>
            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-3">Прикрепленные документы</label>
            <div className="space-y-3">
              {(app.media && app.media.length > 0) ? (
                app.media.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-white border-2 border-dashed border-blue-200 p-4 rounded-2xl hover:bg-blue-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.name || "Документ"}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-tighter font-bold mt-1 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" /> Прикрепленный файл
                        </p>
                      </div>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 hover:text-blue-900 transition-all flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Открыть
                    </a>
                  </div>
                ))
              ) : app.fileUrl ? (
                <div className="flex items-center justify-between bg-white border-2 border-dashed border-blue-200 p-4 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{app.fileName || "Документ"}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-tighter font-bold mt-1 flex items-center gap-1">
                        <Paperclip className="w-3 h-3" /> Прикрепленный файл
                      </p>
                    </div>
                  </div>
                  <a
                    href={app.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 hover:text-blue-900 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Открыть
                  </a>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 font-medium italic">
                  Файлы не прикреплены.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
