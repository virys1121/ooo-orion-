import Link from "next/link";
import Image from "next/image";
import { Shield, Info, ClipboardList, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-blue-950 text-white sticky top-0 z-50 shadow-2xl border-b border-blue-900">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-white p-1 rounded-sm group-hover:scale-105 transition-transform overflow-hidden">
            <Image src="/logo-orion.png" alt="ОРИОН" width={48} height={48} className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter leading-none italic uppercase">ОРИОН</span>
            <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold">имени Бигаева М.А.</span>
          </div>
        </Link>

        <nav className="flex items-center space-x-1 md:space-x-4 mt-4 md:mt-0">
          <Link href="/about" className="flex items-center space-x-1 px-3 py-2 rounded-sm hover:bg-white/10 transition-colors">
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline font-bold uppercase text-xs tracking-wider">О нас</span>
          </Link>
          <Link href="/events" className="flex items-center space-x-1 px-3 py-2 rounded-sm hover:bg-white/10 transition-colors">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline font-bold uppercase text-xs tracking-wider">Островок событий</span>
          </Link>
          <Link href="/apply" className="flex items-center space-x-1 px-3 py-2 rounded-sm hover:bg-white/10 transition-colors">
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline font-bold uppercase text-xs tracking-wider">Поступление</span>
          </Link>

          <div className="h-6 w-[1px] bg-blue-800 mx-2 hidden md:block" />

          {session ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="bg-yellow-400 text-blue-950 px-5 py-2 rounded-sm font-black flex items-center space-x-2 hover:bg-white transition-all text-xs uppercase tracking-tighter shadow-lg">
                <LayoutDashboard className="w-4 h-4" />
                <span>Кабинет</span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/auth/signin" className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-6 py-2 rounded-sm font-black flex items-center space-x-2 hover:bg-yellow-400 hover:text-blue-950 transition-all text-xs uppercase tracking-widest">
              <LogIn className="w-4 h-4" />
              <span>Вход</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
