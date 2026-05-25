import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, childName, parentWorkplace, email, about, childGender } = body;

    if (!parentName || !childName || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        parentName,
        childName,
        parentWorkplace,
        email,
        about,
        childGender,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
