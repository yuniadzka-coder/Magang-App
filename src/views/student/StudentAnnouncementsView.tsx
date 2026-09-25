import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Announcement } from '../../types';
import { Bell, Calendar, User, Search, Filter } from 'lucide-react';

export const StudentAnnouncementsView: React.FC = () => {
  const { announcements } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Papan Pengumuman Magang
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Informasi resmi, instruksi visitasi, dan pengumuman tenggat waktu dari guru pembimbing
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Prioritas:</span>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Prioritas</option>
            <option value="mendesak">Mendesak</option>
            <option value="penting">Penting</option>
            <option value="info">Informasi</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada pengumuman</h3>
            <p className="text-xs text-slate-500 mt-1">
              Belum ada pengumuman yang sesuai dengan filter pencarian Anda.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAnnouncement(item)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge type="priority" status={item.priority} />
                  <span className="text-xs font-mono text-slate-400">·</span>
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.date}
                  </span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {item.teacherName}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line line-clamp-3">
                {item.content}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.teacherRole}</span>
                <span className="font-semibold text-indigo-600 group-hover:underline">
                  Baca Selengkapnya →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Detail Pengumuman */}
      <Modal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.title || 'Pengumuman'}
        subtitle={`Diterbitkan: ${selectedAnnouncement?.date} oleh ${selectedAnnouncement?.teacherName}`}
        maxWidth="lg"
      >
        {selectedAnnouncement && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">Tingkat Prioritas:</span>
              <StatusBadge type="priority" status={selectedAnnouncement.priority} />
            </div>

            <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line p-4 bg-slate-50 rounded-xl border border-slate-100">
              {selectedAnnouncement.content}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>Pengirim: {selectedAnnouncement.teacherName}</span>
              <span className="text-slate-400">{selectedAnnouncement.teacherRole}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
