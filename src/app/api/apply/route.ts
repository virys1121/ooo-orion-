import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let parentName, childName, childAge, phone, workplace, email, about, gender;
    let fileUrl = null;
    let fileName = null;

    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedFiles: { url: string; name: string }[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      parentName = formData.get("parentName") as string;
      childName = formData.get("childName") as string;
      childAge = formData.get("childAge") as string;
      phone = formData.get("phone") as string;
      workplace = formData.get("workplace") as string;
      email = formData.get("email") as string;
      about = formData.get("about") as string;
      gender = formData.get("gender") as string;
      const files = formData.getAll("files") as File[];

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
      ({ parentName, childName, childAge, phone, workplace, email, about, gender } = body);
    }

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
        media: {
          create: uploadedFiles
        }
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
