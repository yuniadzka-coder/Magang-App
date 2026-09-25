import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { JournalEntry } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  Check,
  RotateCcw,
  Calendar,
  Clock,
  User,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

export const TeacherJournalsReviewView: React.FC = () => {
  const { journals, users, reviewJournal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('menunggu_review');
  const [studentFilter, setStudentFilter] = useState('all');

  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [reviewAction, setReviewAction] = useState<'disetujui' | 'perlu_revisi'>('disetujui');
  const [feedbackText, setFeedbackText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const students = users.filter((u) => u.role === 'siswa');

  const filteredJournals = journals.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchesStudent = studentFilter === 'all' || j.studentId === studentFilter;

    return matchesSearch && matchesStatus && matchesStudent;
  });

  const handleOpenReview = (journal: JournalEntry, action: 'disetujui' | 'perlu_revisi') => {
    setSelectedJournal(journal);
    setReviewAction(action);
    setFeedbackText(
      action === 'disetujui'
        ? 'Jurnal telah diperiksa dan disetujui. Uraian aktivitas dan hasil pembelajaran sangat baik!'
        : 'Mohon perbaiki penjelasan kendala teknis dan tambahkan foto dokumentasi yang relevan.'
    );
    setModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJournal) return;
    reviewJournal(selectedJournal.id, reviewAction, feedbackText);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Pusat Review Jurnal Siswa
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tinjau catatan kegiatan harian siswa magang, berikan feedback, dan validasi kompetensi
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, nama siswa, atau kegiatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Status</option>
            <option value="menunggu_review">Menunggu Review</option>
            <option value="disetujui">Disetujui</option>
            <option value="perlu_revisi">Perlu Revisi</option>
            <option value="draft">Draft Siswa</option>
          </select>

          {/* Student Filter */}
          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Siswa</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Journals List */}
      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada jurnal ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tidak ada jurnal yang sesuai dengan kriteria filter saat ini.
            </p>
          </div>
        ) : (
          filteredJournals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-2xs">
                    {journal.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{journal.studentName}</h4>
                    <p className="text-[11px] text-slate-500">{journal.studentClass}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">{journal.date}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">
                    {journal.checkInTime} - {journal.checkOutTime}
                  </span>
                  <StatusBadge type="journal" status={journal.status} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{journal.title}</h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                  {journal.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    Hal yang Dipelajari:
                  </span>
                  <p className="text-slate-600">{journal.learned || '-'}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    Kendala / Masalah:
                  </span>
                  <p className="text-slate-600">{journal.challenges || '-'}</p>
                </div>
              </div>

              {journal.photoUrl && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Foto Kegiatan:
                  </span>
                  <img
                    src={journal.photoUrl}
                    alt={journal.title}
                    className="h-32 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              {journal.feedbackTeacher && (
                <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950">
                  <span className="font-bold text-[11px] block text-amber-900">
                    Feedback Guru ({journal.feedbackDate}):
                  </span>
                  <p className="italic">"{journal.feedbackTeacher}"</p>
                </div>
              )}

              {/* Review Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenReview(journal, 'perlu_revisi')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  Minta Revisi
                </button>
                <button
                  onClick={() => handleOpenReview(journal, 'disetujui')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Setujui Jurnal</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={reviewAction === 'disetujui' ? 'Setujui Jurnal Siswa' : 'Minta Revisi Jurnal'}
        subtitle={`${selectedJournal?.studentName} · ${selectedJournal?.title}`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan & Masukan Pembimbing
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Berikan instruksi atau apresiasi..."
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white font-semibold rounded-xl ${
                reviewAction === 'disetujui' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {reviewAction === 'disetujui' ? 'Konfirmasi Setujui' : 'Kirim Catatan Revisi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
