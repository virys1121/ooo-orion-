"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserListItem from "./UserListItem";

export default function UserList({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
  const router = useRouter();

  async function handleDelete(userId: string) {
    if (!confirm("Вы уверены? Это действие нельзя отменить.")) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Ошибка при удалении");
      }
    } catch (e) {
      alert("Ошибка сети");
    }
  }

  return (
    <div className="space-y-4">
      {initialUsers.map(user => (
        <UserListItem
          key={user.id}
          user={user}
          currentUserId={currentUserId}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
