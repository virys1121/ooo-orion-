"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, X, Users, UserCheck, Edit2, Trash2, Info, Calendar } from "lucide-react";

export default function GroupManager() {
  const [groups, setGroups] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupSchedule, setGroupSchedule] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [groupsRes, teachersRes] = await Promise.all([
      fetch("/api/admin/groups"),
      fetch("/api/admin/teachers")
    ]);
    if (groupsRes.ok) setGroups(await groupsRes.json());
    if (teachersRes.ok) setTeachers(await teachersRes.json());
  }

  function resetForm() {
    setName("");
    setDescription("");
    setGroupSchedule("");
    setSelectedTeachers([]);
    setEditingGroup(null);
    setIsModalOpen(false);
  }

  function handleEdit(group: any) {
    setEditingGroup(group);
    setName(group.name);
    setDescription(group.description || "");
    setGroupSchedule(group.groupSchedule || "");
    setSelectedTeachers(group.teachers);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const url = "/api/admin/groups";
      const method = editingGroup ? "PATCH" : "POST";
      const body = {
        id: editingGroup?.id,
        name,
        description,
        groupSchedule,
        teacherIds: selectedTeachers.map(t => t.id)
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        resetForm();
        fetchData();
        router.refresh();
      } else {
        alert("Ошибка при сохранении группы");
      }
    } catch (e) {
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Вы уверены, что хотите удалить эту группу?")) return;

    try {
      const res = await fetch(`/api/admin/groups?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
        router.refresh();
      }
    } catch (e) {
      alert("Ошибка при удалении");
    }
  }

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Управление группами</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Создать группу
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group/card">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(group)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(group.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-blue-900 mb-2 pr-16">{group.name}</h3>

            {group.description && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description}</p>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Преподаватели</p>
                {group.teachers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {group.teachers.map((t: any) => (
                      <span key={t.id} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {t.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Не назначены</p>
                )}
              </div>

              {group.groupSchedule && (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> График группы
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">{group.groupSchedule}</p>
                </div>
              )}

              <div className="pt-2 border-t flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" /> {group.children.length} детей
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="text-xl font-bold text-blue-900">
                {editingGroup ? "Редактировать группу" : "Новая группа"}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Название группы</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Например: Пчелки"
                      required
                      className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Info className="w-3 h-3" /> Описание / Особенности
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Особенности группы, специализация..."
                      rows={3}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Общий график группы
                    </label>
                    <textarea
                      value={groupSchedule}
                      onChange={(e) => setGroupSchedule(e.target.value)}
                      placeholder="Например: Пн-Пт, 08:00 - 18:00..."
                      rows={3}
                      className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Привязать учителей</label>

                  {selectedTeachers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedTeachers.map(t => (
                        <span key={t.id} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          {t.name}
                          <button type="button" onClick={() => setSelectedTeachers(selectedTeachers.filter(st => st.id !== t.id))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Поиск учителя..."
                      className="w-full border-2 border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-xl divide-y">
                    {filteredTeachers.map(t => {
                      const isSelected = selectedTeachers.some(st => st.id === t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTeachers(selectedTeachers.filter(st => st.id !== t.id));
                            } else {
                              setSelectedTeachers([...selectedTeachers, t]);
                            }
                          }}
                          className={`w-full text-left p-3 flex justify-between items-center hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-800">{t.name}</p>
                            <p className="text-xs text-gray-400">{t.email}</p>
                          </div>
                          {isSelected ? <UserCheck className="w-4 h-4 text-blue-600" /> : <Users className="w-4 h-4 text-gray-300" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-300 shadow-lg shrink-0 mt-auto"
              >
                {loading ? "Сохранение..." : (editingGroup ? "Сохранить изменения" : "Создать группу")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
