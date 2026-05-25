import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <Link
          href="/admin-hidden-panel/users"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Управление пользователями
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Заявки на поступление</h2>
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.length === 0 && (
            <li className="p-4 text-gray-500">Заявок пока нет.</li>
          )}
          {applications.map((app) => (
            <li key={app.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-bold">Ребенок: {app.childName} ({app.childGender === 'MALE' ? 'М' : 'Ж'})</p>
                  <p className="text-sm text-gray-600">Родитель: {app.parentName}</p>
                  <p className="text-sm text-gray-600">Работа: {app.parentWorkplace}</p>
                  <p className="text-sm text-gray-600">Email: {app.email}</p>
                  <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                    <strong>О себе/ребенке:</strong> {app.about}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
