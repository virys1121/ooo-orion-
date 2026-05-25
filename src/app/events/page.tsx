import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "./EventForm";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const news = await prisma.newsPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Островок событий</h1>

      {isAdmin && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Добавить новость</h2>
          <EventForm />
        </div>
      )}

      <div className="grid gap-8">
        {news.length === 0 && (
          <p className="text-center text-gray-500 py-10">Новостей пока нет.</p>
        )}
        {news.map((post) => (
          <article key={post.id} className="bg-white p-8 rounded-2xl shadow-sm border border-blue-50">
            <h3 className="text-2xl font-bold mb-2 text-blue-800">{post.title}</h3>
            <div className="text-sm text-gray-400 mb-4">
              {new Date(post.createdAt).toLocaleDateString("ru-RU")}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
