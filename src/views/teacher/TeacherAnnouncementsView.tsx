import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { AnnouncementPriority } from '../../types';
import { Bell, Plus, Calendar, User, Trash2 } from 'lucide-react';

export const TeacherAnnouncementsView: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('info');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPriority('info');
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title,
      content,
      date,
      priority,
    });

    resetForm();
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Papan Pengumuman Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Siarkan informasi resmi sekolah, jadwal visitasi, dan instruksi PKL ke dashboard siswa
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StatusBadge type="priority" status={item.priority} />
                <span className="text-xs font-mono text-slate-400">·</span>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {item.date}
                </span>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Hapus pengumuman ini?')) {
                    deleteAnnouncement(item.id);
                  }
                }}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                title="Hapus pengumuman"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900">{item.title}</h3>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {item.content}
            </p>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Diterbitkan oleh: <strong className="text-slate-700">{item.teacherName}</strong></span>
              <span>{item.teacherRole}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat Pengumuman */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Buat Pengumuman Baru"
        subtitle="Pengumuman akan langsung tampil di dashboard seluruh siswa bimbingan"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Judul Pengumuman <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Jadwal Visitasi Guru Pembimbing Pekan Depan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tingkat Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="info">Informasi Biasa</option>
                <option value="penting">Penting</option>
                <option value="mendesak">Mendesak</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Isi Pengumuman <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Tuliskan isi instruksi atau informasi secara jelas dan lengkap..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 shadow-xs cursor-pointer"
            >
              Terbitkan Pengumuman
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
