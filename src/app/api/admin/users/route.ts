import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role, childName, childGender, groupName, schedule } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "PARENT" && childName) {
      let group = null;
      if (groupName) {
        group = await prisma.group.upsert({
          where: { name: groupName },
          update: {},
          create: { name: groupName },
        });
      }

      await prisma.child.create({
        data: {
          name: childName,
          gender: childGender,
          schedule: schedule,
          parents: {
            connect: { id: user.id },
          },
          ...(group ? { group: { connect: { id: group.id } } } : {}),
        },
      });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
