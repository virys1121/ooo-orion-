import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import GroupManager from "./GroupManager";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminGroupsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-900 text-white py-12 mb-8 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="bg-white p-2 rounded-2xl shadow-xl">
                <Image src="/logo.png" alt="ОРИОН" width={60} height={60} className="object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-black flex items-center gap-3">
                  Управление Группами
                </h1>
                <p className="text-blue-200 mt-1">Создание и распределение преподавателей</p>
              </div>
            </div>
            <Link href="/admin-hidden-panel" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold transition-all border border-white/20">
              Назад в панель
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <GroupManager />
      </div>
    </div>
  );
}
