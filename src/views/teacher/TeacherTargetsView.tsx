import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Target, TargetStatus } from '../../types';
import {
  Target as TargetIcon,
  Plus,
  Calendar,
  User,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react';

export const TeacherTargetsView: React.FC = () => {
  const { targets, users, addTarget, updateTarget, deleteTarget } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);

  // Form states
  const [targetTitle, setTargetTitle] = useState('');
  const [targetDesc, setTargetDesc] = useState('');
  const [targetStudentId, setTargetStudentId] = useState('all');
  const [targetDeadline, setTargetDeadline] = useState('2026-10-20');

  const students = users.filter((u) => u.role === 'siswa');

  const resetForm = () => {
    setTargetTitle('');
    setTargetDesc('');
    setTargetStudentId('all');
    setTargetDeadline('2026-10-20');
    setEditingTargetId(null);
  };

  const handleOpenEdit = (target: Target) => {
    setEditingTargetId(target.id);
    setTargetTitle(target.title);
    setTargetDesc(target.description);
    setTargetStudentId(target.studentId);
    setTargetDeadline(target.deadline);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTitle.trim()) return;

    const studentObj = students.find((s) => s.id === targetStudentId);
    const studentName = targetStudentId === 'all' ? 'Semua Siswa' : studentObj?.name || 'Siswa';

    if (editingTargetId) {
      updateTarget(editingTargetId, {
        title: targetTitle,
        description: targetDesc,
        studentId: targetStudentId,
        studentName,
        deadline: targetDeadline,
      });
    } else {
      addTarget({
        studentId: targetStudentId,
        studentName,
        title: targetTitle,
        description: targetDesc,
        deadline: targetDeadline,
        status: 'belum_dimulai',
        progress: 0,
      });
    }

    resetForm();
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Target & Kompetensi Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Susun capaian kompetensi, modul tugas, dan tenggat waktu untuk siswa bimbingan
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
          <span>Buat Target Baru</span>
        </button>
      </div>

      {/* Target Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targets.map((target) => {
          return (
            <div
              key={target.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge type="target" status={target.status} />
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {target.studentId === 'all'
                        ? 'Semua Siswa'
                        : target.studentName || 'Siswa Spesifik'}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {target.deadline}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{target.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{target.description}</p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progres Penyelesaian Siswa</span>
                    <span className="font-mono font-bold text-amber-700">{target.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${target.progress}%` }}
                    />
                  </div>
                </div>

                {target.studentNote && (
                  <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-500 block mb-0.5">Catatan Siswa:</span>
                    <p className="italic">"{target.studentNote}"</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Pembimbing: {target.teacherName}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(target)}
                    className="p-1.5 text-slate-400 hover:text-amber-800 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Edit target"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Hapus target magang ini?')) {
                        deleteTarget(target.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus target"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Buat / Edit Target */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          resetForm();
          setModalOpen(false);
        }}
        title={editingTargetId ? 'Edit Target Magang' : 'Buat Target & Tugas Magang Baru'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Target Diberikan Untuk <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetStudentId}
              onChange={(e) => setTargetStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">Semua Siswa Bimbingan</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentClass})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama / Judul Target <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Implementasi Unit Testing & Integrasi CI/CD"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Target & Indikator Keberhasilan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan kriteria kompetensi yang harus dicapai oleh siswa..."
              value={targetDesc}
              onChange={(e) => setTargetDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Batas Waktu (Deadline) <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={targetDeadline}
              onChange={(e) => setTargetDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setModalOpen(false);
              }}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 shadow-xs cursor-pointer"
            >
              {editingTargetId ? 'Simpan Perubahan' : 'Terbitkan Target'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
