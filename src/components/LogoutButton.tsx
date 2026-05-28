"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
      title="Выйти"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
