"use client";

import { useState } from "react";
import EditUserModal from "./EditUserModal";
import { Edit2, Trash2 } from "lucide-react";

export default function UserListItem({ user, currentUserId, onDelete }: { user: any, currentUserId: string, onDelete: (id: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-lg text-blue-900">{user.name}</p>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
              user.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
              user.role === 'TEACHER' ? 'bg-green-100 text-green-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {user.role}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">{user.email}</p>

          {user.children.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest mb-1">Воспитанники:</p>
              <div className="flex flex-wrap gap-2">
                {user.children.map((child: any) => (
                  <span key={child.id} className="text-xs bg-gray-50 border px-2 py-1 rounded-lg text-gray-600">
                    {child.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.managedGroups.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest mb-1">Куратор групп:</p>
              <div className="flex flex-wrap gap-2">
                {user.managedGroups.map((group: any) => (
                  <span key={group.id} className="text-xs bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-lg text-yellow-700">
                    {group.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            title="Редактировать"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          {currentUserId !== user.id && (
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <EditUserModal user={user} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}
