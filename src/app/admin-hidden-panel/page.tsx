import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

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

  return <AdminDashboardClient applications={applications} stats={stats} />;
}
