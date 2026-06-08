import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ScheduleEditor from "./ScheduleEditor";
import NightStayButton from "./NightStayButton";
import Image from "next/image";
import { Calendar, Info, Users, Clock, ShieldCheck, MapPin, Mail, Moon } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      children: {
        include: {
          group: {
            include: {
              teachers: true,
            },
          },
        },
      },
      managedGroups: {
        include: {
          children: {
            include: {
              parents: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  // If teacher, fetch night stay applications for their groups
  let groupApplications: any[] = [];
  if (user.role === "TEACHER") {
    const groupIds = user.managedGroups.map(g => g.id);
    groupApplications = await prisma.application.findMany({
      where: {
        type: "NIGHT_STAY",
        groupId: { in: groupIds },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tight">Личный кабинет</h1>
          <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mt-1">{user.name}</p>
        </div>
        <div className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-yellow-400" />
          {user.role === 'ADMIN' ? 'Администратор' : user.role === 'TEACHER' ? 'Воспитатель' : 'Родитель'}
        </div>
      </div>

      {user.role === "PARENT" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-blue-900/5">
              <h2 className="text-3xl font-black mb-8 text-blue-900 flex items-center gap-4 uppercase tracking-tighter">
                <Users className="w-8 h-8 text-blue-600" />
                Ваши дети
              </h2>
              {user.children.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">У вас пока нет привязанных детей.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {user.children.map((child) => (
                    <div key={child.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-500" />

                      <div className="relative">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-2xl font-black text-gray-800">{child.name}</p>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Группа: {child.group?.name || "Не назначена"}</p>
                          </div>
                          <span className="bg-white px-4 py-1 rounded-full text-xs font-black shadow-sm border border-gray-100 uppercase">
                            {child.gender === 'MALE' ? 'Мальчик' : 'Девочка'}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {child.group && (
                            <div className="space-y-4">
                              <div className="bg-white p-4 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest flex items-center gap-1">
                                  <Info className="w-3 h-3" /> Особенности группы
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {child.group.description || "Индивидуальные особенности не указаны."}
                                </p>
                              </div>
                              <div className="bg-white p-4 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> График группы
                                </p>
                                <p className="text-sm text-gray-600 font-medium italic">
                                  {child.group.groupSchedule || "Общий график не установлен."}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="bg-blue-900 text-white p-4 rounded-2xl shadow-lg shadow-blue-900/20">
                              <p className="text-[10px] font-bold text-blue-300 uppercase mb-2 tracking-widest flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Личное расписание
                              </p>
                              <p className="text-sm whitespace-pre-wrap font-medium">
                                {child.schedule || "Индивидуальное расписание пока не составлено."}
                              </p>
                            </div>

                            {child.group?.teachers.length ? (
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest px-1">Воспитатели группы</p>
                                <div className="space-y-2">
                                  {child.group.teachers.map((t) => (
                                    <div key={t.id} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 text-sm">
                                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {t.name?.[0]}
                                      </div>
                                      <div>
                                        <p className="font-bold text-gray-800">{t.name}</p>
                                        <p className="text-[10px] text-gray-400">{t.email}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-8">
                          <NightStayButton
                            parentName={user.name || ""}
                            childName={child.name}
                            email={user.email || ""}
                            groupId={child.groupId || undefined}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-8">
            <section className="bg-blue-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-900/20">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
                <Info className="w-6 h-6 text-yellow-400" />
                Инфо-центр
              </h2>
              <ul className="space-y-6 text-sm">
                <li className="flex gap-4">
                  <Clock className="w-5 h-5 text-yellow-400 shrink-0" />
                  <div>
                    <p className="font-bold text-blue-200 uppercase text-[10px] tracking-widest mb-1">Режим работы</p>
                    <p>Будни: 07:30 – 19:00</p>
                    <p className="text-yellow-400 font-bold mt-1">Доступен круглосуточный режим</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MapPin className="w-5 h-5 text-yellow-400 shrink-0" />
                  <div>
                    <p className="font-bold text-blue-200 uppercase text-[10px] tracking-widest mb-1">Безопасность</p>
                    <p>Охрана: ЧВК «Вектор»</p>
                    <p>Бункер: Сектор А-12</p>
                  </div>
                </li>
              </ul>
              <div className="mt-10 space-y-3">
                <Link href="/chat" className="block text-center bg-yellow-400 text-blue-900 px-6 py-4 rounded-2xl hover:bg-white transition-all font-black uppercase tracking-widest text-sm shadow-xl">
                  Перейти в чаты
                </Link>
              </div>
            </section>

            <section className="bg-gray-900 text-white p-8 rounded-[3rem] border-4 border-blue-900">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Линия экстренной связи</p>
                <p className="text-2xl font-black mb-1">+7 (999) 123-45-67</p>
                <p className="text-gray-400 text-sm">Для экстренной связи с дежурным администратором</p>
            </section>
          </aside>
        </div>
      )}

      {user.role === "TEACHER" && (
        <div className="space-y-12">
          {groupApplications.length > 0 && (
            <section className="bg-indigo-50 p-8 rounded-[2.5rem] border-2 border-indigo-100 shadow-lg shadow-indigo-900/5">
              <h2 className="text-2xl font-black mb-6 text-indigo-900 flex items-center gap-3">
                <Mail className="w-8 h-8 text-indigo-600" />
                Заявки на ночное пребывание
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {groupApplications.map((app) => (
                  <div key={app.id} className="bg-white p-6 rounded-3xl border border-indigo-200 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
                        {app.childName}
                      </p>
                      <p className="font-bold text-gray-800 italic">"{app.stayDates}"</p>
                      <p className="text-xs text-gray-500 mt-1">От: {app.parentName}</p>
                    </div>
                    <div className="bg-indigo-900 text-white p-2 rounded-xl">
                      <Moon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white p-10 rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-100">
            <h2 className="text-3xl font-black mb-10 text-blue-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1">
                <Image src="/logo.png" alt="ОРИОН" width={32} height={32} className="object-contain" />
              </div>
              Ваши группы
            </h2>
            {user.managedGroups.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-200">
                <p className="text-gray-400 text-xl font-bold">У вас нет назначенных групп.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {user.managedGroups.map((group) => (
                  <div key={group.id} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                      <div>
                        <h3 className="font-black text-3xl text-blue-900">Группа: {group.name}</h3>
                        <div className="flex gap-4 mt-2">
                            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                {group.children.length} детей
                            </span>
                        </div>
                      </div>
                      <Link href="/chat" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                        Открыть чат группы
                      </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest flex items-center gap-1">
                                <Info className="w-3 h-3" /> Описание / Особенности
                            </p>
                            <p className="text-gray-600 font-medium">
                                {group.description || "Индивидуальные особенности не указаны."}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Общий график группы
                            </p>
                            <p className="text-blue-900 font-bold italic">
                                {group.groupSchedule || "Общий график не установлен."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-900 text-white text-[10px] uppercase tracking-widest">
                            <th className="px-8 py-5 font-black">Воспитанник</th>
                            <th className="px-8 py-5 font-black">Родители</th>
                            <th className="px-8 py-5 font-black">Управление расписанием</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {group.children.map(child => (
                            <tr key={child.id} className="hover:bg-blue-50/50 transition-colors">
                              <td className="px-8 py-6 align-top">
                                <p className="font-black text-gray-800 text-lg">{child.name}</p>
                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
                                    {child.gender === 'MALE' ? 'Мальчик' : 'Девочка'}
                                </p>
                              </td>
                              <td className="px-8 py-6 align-top">
                                {child.parents.map(p => (
                                  <div key={p.id} className="mb-3 last:mb-0 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="font-bold text-blue-900 text-sm">{p.name}</p>
                                    <p className="text-[10px] text-gray-400">{p.email}</p>
                                  </div>
                                ))}
                              </td>
                              <td className="px-8 py-6">
                                <ScheduleEditor childId={child.id} initialSchedule={child.schedule} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {user.role === "ADMIN" && (
        <div className="bg-blue-900/5 p-16 rounded-[4rem] border-4 border-dashed border-blue-900/10 text-center">
          <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 overflow-hidden p-2">
            <Image src="/logo.png" alt="ОРИОН" width={80} height={80} className="object-contain" />
          </div>
          <p className="text-3xl font-black mb-2 text-blue-900">Административный доступ</p>
          <p className="text-blue-600 font-medium mb-10 uppercase tracking-widest text-sm">Вы вошли как главный администратор системы</p>
          <Link href="/admin-hidden-panel" className="inline-block bg-blue-900 text-white px-12 py-5 rounded-[2rem] hover:bg-black transition-all font-black uppercase tracking-widest shadow-2xl hover:scale-105 duration-300">
            Открыть Центр Управления
          </Link>
        </div>
      )}
    </div>
  );
}
