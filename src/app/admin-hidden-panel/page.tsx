import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, FileText, Settings, ShieldCheck, Mail, Calendar } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    totalApps: applications.length,
    usersCount: await prisma.user.count(),
    childrenCount: await prisma.child.count(),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-900 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-yellow-400" />
                Центр Управления
              </h1>
              <p className="text-blue-200">Администрирование АНО ЦДО «ОРИОН»</p>
            </div>
            <Link
              href="/admin-hidden-panel/users"
              className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-xl font-black hover:bg-white transition-all flex items-center gap-2 shadow-lg"
            >
              <Users className="w-5 h-5" />
              Управление персоналом и родителями
            </Link>
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
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2">
              <Mail className="w-6 h-6" />
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
                  <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Информация</th>
                  <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Дата</th>
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
                      <p className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-tighter">{app.parentWorkplace}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${app.childGender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                          {app.childGender === 'MALE' ? 'М' : 'Ж'}
                        </div>
                        <p className="font-bold text-gray-800">{app.childName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-gray-600 line-clamp-2 italic">"{app.about}"</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
