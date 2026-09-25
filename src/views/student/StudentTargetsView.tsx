import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Target, TargetStatus } from '../../types';
import {
  Target as TargetIcon,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Edit2,
  Sliders,
} from 'lucide-react';

export const StudentTargetsView: React.FC = () => {
  const { currentUser, targets, updateTarget } = useApp();

  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newProgress, setNewProgress] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<TargetStatus>('belum_dimulai');
  const [studentNote, setStudentNote] = useState('');

  if (!currentUser) return null;

  // Student's targets (assigned specifically or to 'all')
  const studentTargets = targets.filter(
    (t) => t.studentId === currentUser.id || t.studentId === 'all'
  );

  const handleOpenUpdate = (target: Target) => {
    setSelectedTarget(target);
    setNewProgress(target.progress);
    setNewStatus(target.status);
    setStudentNote(target.studentNote || '');
    setModalOpen(true);
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) return;

    let computedStatus = newStatus;
    if (newProgress === 100) {
      computedStatus = 'selesai';
    } else if (newProgress > 0 && computedStatus === 'belum_dimulai') {
      computedStatus = 'sedang_dikerjakan';
    }

    updateTarget(selectedTarget.id, {
      progress: newProgress,
      status: computedStatus,
      studentNote,
    });
    setModalOpen(false);
  };

  const completedCount = studentTargets.filter((t) => t.status === 'selesai').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Target & Kompetensi Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar tugas utama dan target capaian kompetensi yang diberikan oleh guru pembimbing
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border border-amber-200 text-xs text-slate-600 flex items-center gap-2 shadow-2xs self-start sm:self-auto">
          <TargetIcon className="w-4 h-4 text-amber-600" />
          <span>
            Pencapaian: <strong className="text-slate-900 font-mono">{completedCount}</strong> dari{' '}
            <strong className="text-slate-900 font-mono">{studentTargets.length}</strong> Target Selesai
          </span>
        </div>
      </div>

      {/* Targets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentTargets.map((target) => (
          <div
            key={target.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 shadow-2xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <StatusBadge type="target" status={target.status} />
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Batas: {target.deadline}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {target.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {target.description}
              </p>

              {/* Progress Slider Display */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Progres Pengerjaan</span>
                  <span className="font-mono font-bold text-amber-700">{target.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      target.progress === 100
                        ? 'bg-emerald-500'
                        : target.progress > 0
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${target.progress}%` }}
                  />
                </div>
              </div>

              {/* Student Note */}
              {target.studentNote && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Catatan Siswa:
                  </span>
                  <p className="text-slate-700 italic">"{target.studentNote}"</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                Dibuat oleh: {target.teacherName}
              </span>

              <button
                onClick={() => handleOpenUpdate(target)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Update Progres</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Update Progres */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Perbarui Progres Target Magang"
        subtitle={selectedTarget?.title}
        maxWidth="md"
      >
        <form onSubmit={handleSaveUpdate} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">Persentase Selesai:</label>
              <span className="font-mono font-bold text-amber-700 text-sm">
                {newProgress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={newProgress}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setNewProgress(val);
                if (val === 100) {
                  setNewStatus('selesai');
                } else if (val > 0) {
                  setNewStatus('sedang_dikerjakan');
                }
              }}
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0% (Belum)</span>
              <span>50% (Separuh)</span>
              <span>100% (Selesai)</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Status Target</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'belum_dimulai', label: 'Belum Dimulai' },
                  { id: 'sedang_dikerjakan', label: 'Dikerjakan' },
                  { id: 'selesai', label: 'Selesai' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setNewStatus(s.id);
                    if (s.id === 'selesai' && newProgress < 100) setNewProgress(100);
                  }}
                  className={`py-2 px-2 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer ${
                    newStatus === s.id
                      ? 'border-amber-400 bg-amber-100 text-amber-950 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Progres Siswa (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan progres terbaru Anda atau kendala pada target ini..."
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 transition-colors shadow-xs cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
