import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, childName, childAge, phone, workplace, email, about, gender } = body;

    if (!parentName || !childName || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        parentName,
        childName,
        childAge: childAge || "",
        phone: phone || "",
        parentWorkplace: workplace || "",
        email,
        about,
        childGender: gender ? gender.toUpperCase() : "MALE",
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
