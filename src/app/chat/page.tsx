import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ChatInterface from "./ChatInterface";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      children: {
        include: {
          group: true,
        },
      },
      managedGroups: true,
    },
  });

  if (!user) redirect("/");

  // Determine available chat rooms
  let chatRooms: { id: string; name: string; type: "GROUP" | "PRIVATE" }[] = [];

  if (user.role === "PARENT") {
    user.children.forEach((child) => {
      if (child.group) {
        chatRooms.push({
          id: child.group.id,
          name: `Группа: ${child.group.name}`,
          type: "GROUP",
        });
      }
    });
  } else if (user.role === "TEACHER") {
    user.managedGroups.forEach((group) => {
      chatRooms.push({
        id: group.id,
        name: `Группа: ${group.name}`,
        type: "GROUP",
      });
    });
  } else if (user.role === "ADMIN") {
    // Admins can see all group chats
    const allGroups = await prisma.group.findMany();
    allGroups.forEach((group) => {
      chatRooms.push({
        id: group.id,
        name: `Группа: ${group.name}`,
        type: "GROUP",
      });
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-160px)]">
      <h1 className="text-2xl font-bold mb-6">Чат</h1>
      <ChatInterface user={user} rooms={chatRooms} />
    </div>
  );
}
