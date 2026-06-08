"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, FileText, Settings, Mail, Calendar, ExternalLink, Eye } from "lucide-react";
import ApplicationModal from "./ApplicationModal";

export default function AdminDashboardClient({ applications, stats }: { applications: any[], stats: any }) {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-900 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-white p-2 rounded-2xl shadow-xl">
                <Image src="/logo.png" alt="ОРИОН" width={60} height={60} className="object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                  Центр Управления
                </h1>
                <p className="text-blue-200">Администрирование АНО ЦДО «ОРИОН»</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin-hidden-panel/groups"
                className="bg-blue-700 text-white px-8 py-3 rounded-xl font-black hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg border border-blue-500"
              >
                <Settings className="w-5 h-5" />
                Группы
              </Link>
              <Link
                href="/admin-hidden-panel/users"
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-xl font-black hover:bg-white transition-all flex items-center gap-2 shadow-lg"
              >
                <Users className="w-5 h-5" />
                Пользователи
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { label: "Новые заявки", value: stats.totalApps, icon: FileText, color: "bg-blue-800" },
              { label: "Всего аккаунтов", value: stats.usersCount, icon: Users, color: "bg-blue-800" },
              { label: "Воспитанников", value: stats.childrenCount, icon: Settings, color: "bg-blue-800" },
            ].map((stat, i) => (
              <div key={i} className={`${stat.color} p-6 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl`}>
                <div>
                  <p className="text-blue-300 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black mt-1">{stat.value}</p>
                </div>
                <stat.icon className="w-12 h-12 text-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-blue-900">
          <div className="p-10 border-b-4 border-blue-900 flex justify-between items-center bg-blue-50/30">
            <h2 className="text-3xl font-black text-blue-900 flex items-center gap-3 uppercase tracking-tighter">
              <Mail className="w-8 h-8" />
              Входящие заявления
            </h2>
            <span className="bg-blue-100 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">
              Всего: {applications.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Заявитель</th>
                  <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Ребенок</th>
                  <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Дата</th>
                  <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">Заявок пока нет.</td>
                  </tr>
                )}
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-blue-900">{app.parentName}</p>
                      <p className="text-sm text-gray-500">{app.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${app.childGender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                          {app.childGender === 'MALE' ? 'М' : 'Ж'}
                        </div>
                        <p className="font-bold text-gray-800">{app.childName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-400 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="bg-blue-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 hover:text-blue-900 transition-all flex items-center gap-2 ml-auto shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        Открыть
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
