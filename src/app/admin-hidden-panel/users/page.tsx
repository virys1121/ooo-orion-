import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserForm from "./UserForm";
import UserList from "./UserList";

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
          <h2 className="text-2xl font-black text-blue-900 mb-6 uppercase tracking-tight">Список пользователей</h2>
          <UserList initialUsers={users} currentUserId={(session.user as any).id} />
        </div>
      </div>
    </div>
  );
}
