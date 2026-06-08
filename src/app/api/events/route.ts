import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const files = formData.getAll("files") as File[];

    const post = await prisma.newsPost.create({
      data: {
        title,
        content,
        authorId: (session.user as any).id,
      },
    });

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

        let mediaType = "DOCUMENT";
        if (file.type.startsWith("image/")) mediaType = "IMAGE";
        else if (file.type.startsWith("video/")) mediaType = "VIDEO";

        await prisma.newsMedia.create({
          data: {
            url: `/uploads/${uniqueName}`,
            type: mediaType,
            name: file.name,
            postId: post.id,
          },
        });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
