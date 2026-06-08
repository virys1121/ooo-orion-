import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Helper function to check if user has access to a room
async function checkAccess(userId: string, role: string, roomId: string, isPrivate: boolean) {
  if (role === 'ADMIN') return true;

  if (isPrivate) {
    if (role === 'PARENT') {
      const teacher = await prisma.user.findFirst({
        where: {
          id: roomId,
          role: 'TEACHER',
          managedGroups: {
            some: {
              children: {
                some: {
                  parents: {
                    some: { id: userId }
                  }
                }
              }
            }
          }
        }
      });
      return !!teacher;
    }

    if (role === 'TEACHER') {
      const parent = await prisma.user.findFirst({
        where: {
          id: roomId,
          role: 'PARENT',
          children: {
            some: {
              group: {
                teachers: {
                  some: { id: userId }
                }
              }
            }
          }
        }
      });
      return !!parent;
    }
  } else {
    // Group chat
    if (role === 'TEACHER') {
      const group = await prisma.group.findFirst({
        where: {
          id: roomId,
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
          groupId: roomId,
          parents: {
            some: { id: userId }
          }
        }
      });
      return !!child;
    }
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
    const receiverId = searchParams.get("receiverId");

    if (!groupId && !receiverId) {
      return NextResponse.json({ error: "Missing groupId or receiverId" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (groupId) {
      const hasAccess = await checkAccess(userId, role, groupId, false);
      if (!hasAccess) {
        return NextResponse.json({ error: "Forbidden: No access to this group" }, { status: 403 });
      }

      const messages = await prisma.message.findMany({
        where: { groupId },
        include: {
          sender: {
            select: { name: true, id: true },
          },
          media: true,
        },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(messages);
    } else {
      const hasAccess = await checkAccess(userId, role, receiverId!, true);
      if (!hasAccess) {
        return NextResponse.json({ error: "Forbidden: No access to this private chat" }, { status: 403 });
      }

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: receiverId! },
            { senderId: receiverId!, receiverId: userId },
          ],
        },
        include: {
          sender: {
            select: { name: true, id: true },
          },
          media: true,
        },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(messages);
    }
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

    const contentType = req.headers.get("content-type") || "";
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let content = "";
    let groupId = null;
    let receiverId = null;
    const uploadedFiles: { url: string; name: string }[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      content = formData.get("content") as string;
      groupId = formData.get("groupId") as string;
      receiverId = formData.get("receiverId") as string;
      const files = formData.getAll("files") as File[];

      const uploadsDir = join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      for (const file of files) {
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uniqueName = `${Date.now()}-${file.name}`;
          const path = join(uploadsDir, uniqueName);
          await writeFile(path, buffer);

          uploadedFiles.push({
            url: `/uploads/${uniqueName}`,
            name: file.name
          });
        }
      }
    } else {
      const body = await req.json();
      content = body.content;
      groupId = body.groupId;
      receiverId = body.receiverId;
    }

    if (!content && uploadedFiles.length === 0) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const targetId = (groupId || receiverId) as string;
    const hasAccess = await checkAccess(userId, role, targetId, !!receiverId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden: Cannot send messages to this room" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content: content || null,
        groupId: groupId || null,
        receiverId: receiverId || null,
        senderId: userId,
        media: {
          create: uploadedFiles
        }
      },
      include: {
        sender: {
          select: { name: true, id: true },
        },
        media: true,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
