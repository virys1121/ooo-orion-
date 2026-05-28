"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Вы уверены, что хотите удалить этот аккаунт?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert("Ошибка: " + err.error);
      }
    } catch (error) {
      alert("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
      title="Удалить пользователя"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
