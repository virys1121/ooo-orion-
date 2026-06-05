import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { parentName, childName, email, stayDates, groupId } = await req.json();

    if (!stayDates) {
      return NextResponse.json({ error: "Dates are required" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        parentName,
        childName,
        email,
        parentWorkplace: "From Dashboard",
        about: "Night Stay Request",
        childGender: "MALE",
        type: "NIGHT_STAY",
        stayDates,
        groupId,
        status: "PENDING",
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
