import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "./EventForm";
import { Calendar, FileText, Download, ExternalLink, Shield } from "lucide-react";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/events");
  }

  const news = await prisma.newsPost.findMany({
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-blue-900 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">Островок событий</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto font-medium">
            Актуальные новости, события и важные объявления АНО ЦДО «ОРИОН»
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {isAdmin && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-900 p-2 rounded-lg text-white">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Добавить новость</h2>
            </div>
            <EventForm />
          </div>
        )}

        <div className="space-y-12">
          {news.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-blue-900/10 shadow-2xl">
              <p className="text-gray-400 text-xl font-black uppercase tracking-widest italic">Событий пока не зафиксировано.</p>
            </div>
          )}

          {news.map((post) => (
            <article key={post.id} className="bg-white rounded-[3rem] shadow-2xl border-4 border-blue-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {post.media.length > 0 && (
                <div className="bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
                  {post.media.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden">
                      {item.type === "IMAGE" ? (
                        <div className="aspect-video relative overflow-hidden bg-gray-100 rounded-2xl">
                          <img
                            src={item.url}
                            alt={item.name || ""}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          />
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <ExternalLink className="text-white w-8 h-8" />
                          </a>
                        </div>
                      ) : item.type === "VIDEO" ? (
                        <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden">
                          <video src={item.url} controls className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="p-6 bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 h-full">
                          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 w-full px-2">
                            <p className="font-bold text-blue-900 text-sm truncate">{item.name || "Файл"}</p>
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400 hover:text-blue-900 transition-all flex items-center gap-2 shadow-md"
                          >
                            <Download className="w-3 h-3" />
                            Скачать
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="p-10 md:p-12">
                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                <h3 className="text-3xl font-black mb-6 text-blue-900 leading-tight tracking-tighter">
                  {post.title}
                </h3>

                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg font-medium opacity-90">
                  {post.content}
                </p>

              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
