import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper function to check if user has access to a group
async function checkGroupAccess(userId: string, role: string, groupId: string) {
  if (role === 'ADMIN') return true;

  if (role === 'TEACHER') {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        teachers: {
          some: { id: userId }
        }
      }
    });
    return !!group;
  }

  if (role === 'PARENT') {
    const child = await prisma.child.findFirst({
      where: {
        groupId,
        parents: {
          some: { id: userId }
        }
      }
    });
    return !!child;
  }

  return false;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const hasAccess = await checkGroupAccess(userId, role, groupId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: No access to this group" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { groupId },
      include: {
        sender: {
          select: { name: true, id: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, groupId } = body;

    if (!content || !groupId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const hasAccess = await checkGroupAccess(userId, role, groupId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: Cannot send messages to this group" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        groupId,
        senderId: userId,
      },
      include: {
        sender: {
          select: { name: true, id: true },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
