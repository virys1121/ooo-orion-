import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserForm from "./UserForm";
import DeleteUserButton from "./DeleteUserButton";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const groups = await prisma.group.findMany();
  const users = await prisma.user.findMany({
    include: {
      children: true,
      managedGroups: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Управление пользователями и группами</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Добавить нового пользователя</h2>
          <UserForm groups={groups} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Список пользователей</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="bg-white p-4 rounded shadow border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{user.name} <span className="text-xs font-normal text-gray-500">({user.role})</span></p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.children.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Дети:</p>
                        <ul className="text-sm">
                          {user.children.map(child => (
                            <li key={child.id}>• {child.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {(session.user as any).id !== user.id && (
                    <DeleteUserButton userId={user.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
