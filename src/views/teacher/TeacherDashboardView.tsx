import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { JournalEntry, User } from '../../types';
import {
  Users,
  UserCheck,
  CalendarCheck,
  BookOpen,
  Target as TargetIcon,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  AlertTriangle,
  PlusCircle,
  Check,
  MessageSquare,
} from 'lucide-react';

interface TeacherDashboardViewProps {
  onSelectStudent: (studentId: string) => void;
  onNavigate: (tab: string) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  onSelectStudent,
  onNavigate,
}) => {
  const {
    currentUser,
    users,
    places,
    journals,
    attendance,
    targets,
    reviewJournal,
  } = useApp();

  const [reviewModalJournal, setReviewModalJournal] = useState<JournalEntry | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [reviewActionType, setReviewActionType] = useState<'disetujui' | 'perlu_revisi'>('disetujui');

  const students = users.filter((u) => u.role === 'siswa');
  const totalStudents = students.length;
  const activeStudents = totalStudents; // All currently active in PKL

  // Pending journals count
  const pendingJournals = journals.filter((j) => j.status === 'menunggu_review');

  // Overall attendance calculation
  const totalAttendanceRecords = attendance.length;
  const totalHadirRecords = attendance.filter((a) => a.status === 'hadir').length;
  const avgAttendance =
    totalAttendanceRecords > 0
      ? Math.round((totalHadirRecords / totalAttendanceRecords) * 100)
      : 96;

  // Unfinished targets
  const unfinishedTargets = targets.filter((t) => t.status !== 'selesai').length;

  const handleOpenReview = (journal: JournalEntry, type: 'disetujui' | 'perlu_revisi') => {
    setReviewModalJournal(journal);
    setReviewActionType(type);
    setFeedbackInput(
      type === 'disetujui'
        ? 'Bagus sekali, kegiatan dan pembelajaran tercatat dengan jelas dan rapi!'
        : 'Mohon lengkapi kendala yang dihadapi dan lampirkan bukti foto kegiatan yang relevan.'
    );
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalJournal) return;
    reviewJournal(reviewModalJournal.id, reviewActionType, feedbackInput);
    setReviewModalJournal(null);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Header */}
      <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Portal Guru Pembimbing PKL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Selamat Datang, {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser?.department || 'Koordinator Magang'} · {currentUser?.school}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('target')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Buat Target Magang</span>
          </button>
          <button
            onClick={() => onNavigate('pengumuman')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Buat Pengumuman</span>
          </button>
        </div>
      </div>

      {/* 5 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Siswa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Siswa</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">{totalStudents}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Bimbingan PKL</span>
        </div>

        {/* Siswa Aktif */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Siswa Aktif</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-2">{activeStudents}</p>
          <span className="text-[11px] text-emerald-600 mt-1 block">100% di Industri</span>
        </div>

        {/* Rata-rata Kehadiran */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rata-rata Presensi</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">{avgAttendance}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Berdasarkan presensi harian</span>
        </div>

        {/* Jurnal Menunggu Review */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Perlu Review</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-2">
            {pendingJournals.length}
          </p>
          <span className="text-[11px] text-amber-700 mt-1 block font-semibold">Jurnal baru masuk</span>
        </div>

        {/* Target Belum Selesai */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Target Berjalan</span>
            <TargetIcon className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {unfinishedTargets}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Tugas aktif siswa</span>
        </div>
      </div>

      {/* Review Queue Spotlight (If pending journals exist) */}
      {pendingJournals.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-950">
                Antrean Review Jurnal ({pendingJournals.length} Menunggu Tindakan)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('jurnal')}
              className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat di Pusat Review →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingJournals.slice(0, 2).map((j) => (
              <div
                key={j.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{j.studentName}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{j.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{j.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {j.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenReview(j, 'perlu_revisi')}
                    className="px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Minta Revisi
                  </button>
                  <button
                    onClick={() => handleOpenReview(j, 'disetujui')}
                    className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Siswa Bimbingan Magang
            </h3>
            <p className="text-xs text-slate-500">
              Pantau perkembangan jurnal, presensi, dan target kompetensi masing-masing siswa
            </p>
          </div>
          <button
            onClick={() => onNavigate('siswa')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Kelola Semua Siswa</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Siswa</th>
                <th className="px-5 py-3.5">Kelas & NISN</th>
                <th className="px-5 py-3.5">Tempat Magang</th>
                <th className="px-5 py-3.5 font-mono">Kehadiran</th>
                <th className="px-5 py-3.5 font-mono">Jurnal</th>
                <th className="px-5 py-3.5">Status PKL</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map((student) => {
                const place = places.find((p) => p.id === student.internshipPlaceId);
                const sAttendance = attendance.filter((a) => a.studentId === student.id);
                const sHadir = sAttendance.filter((a) => a.status === 'hadir').length;
                const sPercent =
                  sAttendance.length > 0 ? Math.round((sHadir / sAttendance.length) * 100) : 100;
                const sJournals = journals.filter((j) => j.studentId === student.id);

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    onClick={() => onSelectStudent(student.id)}
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-slate-800 font-medium block">
                        {student.studentClass}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        NISN: {student.nisn || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate">
                      <span className="font-medium text-slate-800 block truncate">
                        {place?.name || '-'}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {place?.companyMentorName || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono font-medium">
                      <span
                        className={
                          sPercent >= 85 ? 'text-emerald-700' : 'text-amber-700'
                        }
                      >
                        {sPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {sHadir} Hari Hadir
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono font-medium text-slate-800">
                      {sJournals.length} Jurnal
                      <span className="text-[10px] text-emerald-600 block font-sans">
                        {sJournals.filter((j) => j.status === 'disetujui').length} Disetujui
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        Aktif
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail Siswa</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModalJournal}
        onClose={() => setReviewModalJournal(null)}
        title={
          reviewActionType === 'disetujui' ? 'Setujui Jurnal Siswa' : 'Minta Revisi Jurnal'
        }
        subtitle={`${reviewModalJournal?.studentName} · ${reviewModalJournal?.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {reviewActionType === 'disetujui'
                ? 'Catatan Apresiasi / Feedback Guru (Opsional)'
                : 'Poin-poin yang Perlu Direvisi (Wajib)'}
            </label>
            <textarea
              rows={4}
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="Tuliskan komentar atau instruksi perbaikan..."
              required={reviewActionType === 'perlu_revisi'}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewModalJournal(null)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white font-semibold rounded-xl transition-colors shadow-xs ${
                reviewActionType === 'disetujui'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {reviewActionType === 'disetujui' ? 'Konfirmasi Setujui' : 'Kirim Catatan Revisi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
