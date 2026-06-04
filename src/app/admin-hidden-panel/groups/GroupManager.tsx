"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, X, Users, UserCheck } from "lucide-react";

export default function GroupManager() {
  const [groups, setGroups] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
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

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroupName,
          teacherIds: selectedTeachers.map(t => t.id)
        }),
      });

      if (res.ok) {
        setNewGroupName("");
        setSelectedTeachers([]);
        setIsModalOpen(false);
        fetchData();
        router.refresh();
      } else {
        alert("Ошибка при создании группы");
      }
    } catch (e) {
      alert("Ошибка сети");
    } finally {
      setLoading(false);
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
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Создать группу
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <div key={group.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-900 mb-4">{group.name}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Преподаватели:</p>
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
              <div className="pt-2 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">Детей: {group.children.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-blue-900">Новая группа</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Название группы</label>
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Например: Пчелки"
                  required
                  className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Привязать учителей</label>

                {selectedTeachers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTeachers.map(t => (
                      <span key={t.id} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        {t.name}
                        <button onClick={() => setSelectedTeachers(selectedTeachers.filter(st => st.id !== t.id))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Поиск учителя..."
                    className="w-full border-2 border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto border rounded-xl divide-y">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-300 shadow-lg"
              >
                {loading ? "Создание..." : "Создать группу"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
