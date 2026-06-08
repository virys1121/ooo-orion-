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
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <h1 className="text-5xl font-black mb-16 text-blue-900 uppercase tracking-tighter">
        Контроль <span className="text-yellow-500">Персонала и Родителей</span>
      </h1>

      <div className="grid lg:grid-cols-2 gap-20">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-blue-900/10 h-fit">
          <h2 className="text-2xl font-black mb-8 text-blue-900 uppercase tracking-widest border-b-4 border-yellow-400 pb-2 inline-block">
            Регистрация
          </h2>
          <UserForm groups={groups} />
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-blue-900/10">
          <h2 className="text-2xl font-black text-blue-900 mb-8 uppercase tracking-widest border-b-4 border-yellow-400 pb-2 inline-block">
            База Данных
          </h2>
          <UserList initialUsers={users} currentUserId={(session.user as any).id} />
        </div>
      </div>
    </div>
  );
}
