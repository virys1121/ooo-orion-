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
              {post.mediaUrl && (
                <div className="bg-gray-100 border-b border-gray-100">
                  {post.mediaType === "IMAGE" ? (
                    <div className="relative aspect-video max-h-[600px] w-full overflow-hidden">
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : post.mediaType === "VIDEO" ? (
                    <div className="aspect-video w-full bg-black">
                      <video src={post.mediaUrl} controls className="w-full h-full" />
                    </div>
                  ) : (
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="bg-blue-100 p-6 rounded-3xl text-blue-600 shadow-inner">
                        <FileText className="w-12 h-12" />
                      </div>
                      <div>
                        <p className="font-black text-blue-900 text-lg">{post.fileName || "Документ"}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Прикрепленный файл</p>
                      </div>
                      <a
                        href={post.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-blue-900 transition-all flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Скачать документ
                      </a>
                    </div>
                  )}
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

                {post.mediaUrl && post.mediaType !== "DOCUMENT" && (
                  <div className="mt-8 pt-8 border-t border-gray-50 flex justify-end">
                    <a
                      href={post.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-900 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Открыть в полном размере
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
