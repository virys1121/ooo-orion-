import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { childId, schedule } = await req.json();

    // Verify the teacher manages the group this child is in
    const teacherId = (session.user as any).id;
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: { group: { include: { teachers: true } } }
    });

    if (!child || !child.group || !child.group.teachers.some(t => t.id === teacherId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: { schedule },
    });

    return NextResponse.json(updatedChild);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
