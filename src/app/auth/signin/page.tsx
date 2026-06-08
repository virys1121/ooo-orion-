"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Неверный email или пароль");
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-blue-900">
      <div>
        <div className="flex justify-center mb-6">
          <div className="bg-blue-900 p-4 rounded-3xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-blue-900 uppercase tracking-tighter italic">
          Вход <span className="text-yellow-500">ОРИОН</span>
        </h2>
        <p className="mt-4 text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
          Авторизация доступа
        </p>
      </div>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <input
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-4 border-2 border-blue-900/10 placeholder-gray-400 text-blue-900 rounded-2xl focus:outline-none focus:border-blue-900 transition-all font-bold"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="appearance-none relative block w-full px-4 py-4 border-2 border-blue-900/10 placeholder-gray-400 text-blue-900 rounded-2xl focus:outline-none focus:border-blue-900 transition-all font-bold"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center font-black uppercase tracking-tight py-2 bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-5 px-4 border-none text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-blue-900 hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg"
          >
            {loading ? "Синхронизация..." : "Войти"}
          </button>
        </div>
      </form>

      <div className="text-center">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-blue-900 font-bold">Загрузка формы...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
