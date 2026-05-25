"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          АНО ЦДО «ОРИОН»
        </Link>
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-blue-200">Главная</Link>
          <Link href="/events" className="hover:text-blue-200">Островок событий</Link>
          <Link href="/apply" className="hover:text-blue-200">Заявка на поступление</Link>

          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-200">Личный кабинет</Link>
              <Link href="/chat" className="hover:text-blue-200">Чат</Link>
              <button
                onClick={() => signOut()}
                className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900"
              >
                Выход
              </button>
            </>
          ) : (
            <Link href="/api/auth/signin" className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900">
              Вход
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
