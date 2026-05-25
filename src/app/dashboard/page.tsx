import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет: {user.name}</h1>

      {user.role === "PARENT" && (
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Ваши дети</h2>
            {user.children.length === 0 ? (
              <p className="text-gray-500">У вас пока нет привязанных детей.</p>
            ) : (
              <ul className="space-y-6">
                {user.children.map((child) => (
                  <li key={child.id} className="border-b pb-4 last:border-0">
                    <p className="text-lg font-semibold">{child.name}</p>
                    <p className="text-sm text-gray-600">Группа: {child.group?.name || "Не назначена"}</p>

                    {child.schedule && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm">
                        <p className="font-bold text-green-800 mb-1">Расписание:</p>
                        <p className="whitespace-pre-wrap">{child.schedule}</p>
                      </div>
                    )}

                    {child.group?.teachers.length ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Воспитатели:</p>
                        <ul className="text-sm mt-1">
                          {child.group.teachers.map((t) => (
                            <li key={t.id} className="flex items-center space-x-2">
                              <span>• {t.name}</span>
                              <span className="text-gray-400">({t.email})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Общая информация</h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>📌 График работы сада: 07:30 – 19:00</li>
              <li>📌 Питание: 5-разовое, сбалансированное</li>
              <li>📌 Важные контакты: +7 (999) 123-45-67</li>
            </ul>
            <div className="mt-8 space-y-3">
              <Link href="/chat" className="block text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold transition-colors">
                Перейти в чаты
              </Link>
            </div>
          </section>
        </div>
      )}

      {user.role === "TEACHER" && (
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Ваши группы</h2>
            {user.managedGroups.length === 0 ? (
              <p className="text-gray-500">У вас нет назначенных групп.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {user.managedGroups.map((group) => (
                  <div key={group.id} className="border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-bold text-lg mb-2">Группа: {group.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Количество детей: {group.children.length}</p>
                    <Link href="/chat" className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700">
                      Открыть чат группы
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {user.role === "ADMIN" && (
        <div className="bg-gray-50 p-10 rounded-2xl border-2 border-dashed border-gray-300 text-center">
          <p className="text-xl mb-4 text-gray-600">Вы вошли как Администратор</p>
          <Link href="/admin-hidden-panel" className="inline-block bg-gray-800 text-white px-8 py-4 rounded-xl hover:bg-black transition-colors font-bold shadow-lg">
            Перейти в панель управления
          </Link>
        </div>
      )}
    </div>
  );
}
