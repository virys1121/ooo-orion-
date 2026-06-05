import Link from "next/link";
import Image from "next/image";
import { Shield, Info, ClipboardList, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-blue-900 text-white sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-white p-1 rounded-lg group-hover:rotate-12 transition-transform overflow-hidden">
            <Image src="/logo.png" alt="ОРИОН" width={40} height={40} className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">ЦДО «ОРИОН»</span>
            <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold">имени Бигаева М.А.</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-1 md:space-x-4 mt-4 md:mt-0">
          <Link href="/about" className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">О нас</span>
          </Link>
          <Link href="/events" className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Островок событий</span>
          </Link>
          <Link href="/apply" className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Поступление</span>
          </Link>

          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold flex items-center space-x-2 hover:bg-white hover:text-blue-900 transition-all">
                <LayoutDashboard className="w-4 h-4" />
                <span>Кабинет</span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/auth/signin" className="border-2 border-yellow-400 text-yellow-400 px-6 py-2 rounded-full font-bold flex items-center space-x-2 hover:bg-yellow-400 hover:text-blue-900 transition-all">
              <LogIn className="w-4 h-4" />
              <span>Вход</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
