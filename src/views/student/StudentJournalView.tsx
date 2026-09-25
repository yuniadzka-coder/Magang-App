import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { JournalEntry, JournalStatus } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Send,
  Save,
  BookOpen,
  Image as ImageIcon,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Upload,
} from 'lucide-react';

import imgWorkspace from '../../assets/images/magang_doc_workspace_1790318210334.jpg';
import imgMentoring from '../../assets/images/magang_doc_mentoring_1790318232385.jpg';
import imgPresentation from '../../assets/images/magang_doc_presentation_1790318248757.jpg';
import imgNetworking from '../../assets/images/magang_doc_networking_1790318262225.jpg';

export const StudentJournalView: React.FC = () => {
  const {
    currentUser,
    journals,
    addJournal,
    updateJournal,
    deleteJournal,
    submitJournalDraft,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'riwayat' | 'tulis'>('riwayat');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Selected journal for modal detail or editing
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);

  // Form states
  const todayStr = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    date: todayStr,
    checkInTime: '08:00',
    checkOutTime: '17:00',
    title: '',
    description: '',
    learned: '',
    challenges: '',
    photoUrl: imgWorkspace,
  });

  const [validationError, setValidationError] = useState('');

  if (!currentUser) return null;

  // Filter journals for current student
  const studentJournals = journals.filter((j) => j.studentId === currentUser.id);

  const filteredJournals = studentJournals.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.learned.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    const matchesDate = !dateFilter || j.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const resetForm = () => {
    setFormData({
      date: todayStr,
      checkInTime: '08:00',
      checkOutTime: '17:00',
      title: '',
      description: '',
      learned: '',
      challenges: '',
      photoUrl: imgWorkspace,
    });
    setEditingJournalId(null);
    setValidationError('');
  };

  const handleEditJournal = (journal: JournalEntry) => {
    setFormData({
      date: journal.date,
      checkInTime: journal.checkInTime,
      checkOutTime: journal.checkOutTime,
      title: journal.title,
      description: journal.description,
      learned: journal.learned,
      challenges: journal.challenges,
      photoUrl: journal.photoUrl || imgWorkspace,
    });
    setEditingJournalId(journal.id);
    setActiveTab('tulis');
    setSelectedJournal(null);
  };

  const handleSaveForm = (asDraft: boolean) => {
    setValidationError('');
    if (!formData.title.trim()) {
      setValidationError('Judul kegiatan wajib diisi.');
      return;
    }
    if (!formData.description.trim()) {
      setValidationError('Deskripsi kegiatan wajib diisi.');
      return;
    }

    const status: JournalStatus = asDraft ? 'draft' : 'menunggu_review';

    if (editingJournalId) {
      updateJournal(editingJournalId, {
        date: formData.date,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        title: formData.title,
        description: formData.description,
        learned: formData.learned,
        challenges: formData.challenges,
        photoUrl: formData.photoUrl,
        status,
      });
      resetForm();
      setActiveTab('riwayat');
    } else {
      addJournal({
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentClass: currentUser.studentClass || 'Siswa SMA',
        date: formData.date,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        title: formData.title,
        description: formData.description,
        learned: formData.learned,
        challenges: formData.challenges,
        photoUrl: formData.photoUrl,
        status,
      });
      resetForm();
      setActiveTab('riwayat');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Jurnal Kegiatan Harian
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Catat ringkasan pekerjaan, pembelajaran harian, dan dokumentasi foto magang
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-amber-50/80 border border-amber-200 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('riwayat');
              resetForm();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'riwayat'
                ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Riwayat Jurnal ({studentJournals.length})
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveTab('tulis');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'tulis'
                ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingJournalId ? 'Edit Jurnal' : 'Tulis Jurnal'}</span>
          </button>
        </div>
      </div>

      {/* VIEW: TULIS / EDIT JURNAL FORM */}
      {activeTab === 'tulis' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingJournalId ? 'Edit Jurnal Kegiatan' : 'Formulir Jurnal Kegiatan Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Lengkapi rincian aktivitas dan hasil pembelajaran magang Anda
              </p>
            </div>
            {editingJournalId && (
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('riwayat');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Batal Edit
              </button>
            )}
          </div>

          {validationError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Grid 3: Tanggal, Jam Masuk, Jam Pulang */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Kegiatan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Masuk <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jam Pulang <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Judul Kegiatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul / Topik Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Slicing UI Halaman Checkout & Refactoring Komponen"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Deskripsi Kegiatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Rinci Pekerjaan / Kegiatan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan apa saja tugas yang dikerjakan hari ini secara runut..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Hal yang Dipelajari */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hal yang Dipelajari (Knowledge / Skill Gain)
              </label>
              <textarea
                rows={2}
                placeholder="Pengetahuan baru, tools baru, atau best practice yang dipelajari..."
                value={formData.learned}
                onChange={(e) => setFormData({ ...formData, learned: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Kendala yang Dialami */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kendala / Masalah yang Dihadapi & Solusinya
              </label>
              <textarea
                rows={2}
                placeholder="Kendala teknis atau koordinasi dan bagaimana Anda mengatasinya..."
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Upload Foto Dokumentasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Foto Dokumentasi Kegiatan
              </label>
              <div className="space-y-3">
                {/* File picker */}
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pilih Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">atau pilih foto sampel magang di bawah:</span>
                </div>

                {/* Preset image selector */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { url: imgWorkspace, label: 'Workspace' },
                    { url: imgMentoring, label: 'Mentoring' },
                    { url: imgPresentation, label: 'Presentasi' },
                    { url: imgNetworking, label: 'Jaringan' },
                  ].map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, photoUrl: img.url })}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all group aspect-4/3 cursor-pointer ${
                        formData.photoUrl === img.url
                          ? 'border-amber-500 ring-2 ring-amber-300'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Preview */}
                {formData.photoUrl && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 inline-block">
                    <p className="text-[11px] font-semibold text-slate-600 mb-1">Preview Foto Terpilih:</p>
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      className="h-32 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Simpan Draft & Kirim Jurnal */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSaveForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-500" />
                <span>Simpan Sebagai Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveForm(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Kirim Jurnal ke Guru</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: RIWAYAT JURNAL */}
      {activeTab === 'riwayat' && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {/* Filters & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari jurnal berdasarkan judul atau kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex flex-wrap items-center gap-2">
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
                <option value="draft">Draft</option>
                <option value="menunggu_review">Menunggu Review</option>
                <option value="disetujui">Disetujui</option>
                <option value="perlu_revisi">Perlu Revisi</option>
              </select>

              {/* Filter by Date */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none"
                title="Filter berdasarkan tanggal"
              />

              {(searchTerm || statusFilter !== 'all' || dateFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('');
                  }}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold px-2 py-1 cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Journal List / Cards */}
          {filteredJournals.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Tidak ada catatan jurnal</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'all' || dateFilter
                  ? 'Tidak ditemukan jurnal yang cocok dengan filter pencarian Anda.'
                  : 'Anda belum mencatat kegiatan magang. Mulai dengan membuat jurnal hari ini!'}
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('tulis');
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Jurnal Baru</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredJournals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  {/* Photo Thumbnail */}
                  {journal.photoUrl && (
                    <img
                      src={journal.photoUrl}
                      alt={journal.title}
                      onClick={() => setSelectedJournal(journal)}
                      className="w-full md:w-36 h-28 object-cover rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    />
                  )}

                  {/* Main Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {journal.date}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {journal.checkInTime} - {journal.checkOutTime}
                      </span>
                      <StatusBadge type="journal" status={journal.status} />
                    </div>

                    <h3
                      onClick={() => setSelectedJournal(journal)}
                      className="text-sm font-bold text-slate-900 hover:text-amber-800 transition-colors cursor-pointer leading-snug"
                    >
                      {journal.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {journal.description}
                    </p>

                    {/* Teacher Feedback Banner */}
                    {journal.feedbackTeacher && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-[11px] text-amber-950">
                            Feedback Guru Pembimbing:
                          </span>
                          <span className="text-[10px] text-amber-700 font-mono">
                            {journal.feedbackDate}
                          </span>
                        </div>
                        <p className="text-amber-900 italic leading-relaxed text-[11px]">
                          "{journal.feedbackTeacher}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => setSelectedJournal(journal)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Detail
                    </button>

                    {(journal.status === 'draft' || journal.status === 'perlu_revisi') && (
                      <button
                        onClick={() => handleEditJournal(journal)}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}

                    {journal.status === 'draft' && (
                      <button
                        onClick={() => submitJournalDraft(journal.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3 text-slate-950" />
                        <span>Kirim</span>
                      </button>
                    )}

                    {journal.status === 'draft' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus draf jurnal ini?')) {
                            deleteJournal(journal.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Hapus draf"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Detail Jurnal */}
      <Modal
        isOpen={!!selectedJournal}
        onClose={() => setSelectedJournal(null)}
        title={selectedJournal?.title || 'Detail Jurnal Kegiatan'}
        subtitle={`Tanggal: ${selectedJournal?.date} · Jam: ${selectedJournal?.checkInTime} - ${selectedJournal?.checkOutTime}`}
        maxWidth="xl"
      >
        {selectedJournal && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Status Jurnal:</span>
              <StatusBadge type="journal" status={selectedJournal.status} />
            </div>

            <div>
              <h5 className="font-bold text-slate-800 mb-1">Deskripsi Kegiatan:</h5>
              <div className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 whitespace-pre-line">
                {selectedJournal.description}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-800 mb-1">Hal yang Dipelajari:</h5>
              <div className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 whitespace-pre-line">
                {selectedJournal.learned || '-'}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-800 mb-1">Kendala & Pemecahan Masalah:</h5>
              <div className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 whitespace-pre-line">
                {selectedJournal.challenges || 'Tidak ada kendala berarti.'}
              </div>
            </div>

            {selectedJournal.photoUrl && (
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Dokumentasi Foto:</h5>
                <img
                  src={selectedJournal.photoUrl}
                  alt={selectedJournal.title}
                  className="w-full h-64 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
              </div>
            )}

            {selectedJournal.feedbackTeacher && (
              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-950 text-xs">
                    Catatan Guru Pembimbing:
                  </span>
                  <span className="text-[10px] text-amber-700 font-mono">
                    {selectedJournal.feedbackDate}
                  </span>
                </div>
                <p className="text-amber-950 leading-relaxed italic">
                  "{selectedJournal.feedbackTeacher}"
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
              <span>Dibuat: {selectedJournal.createdAt}</span>
              {(selectedJournal.status === 'draft' || selectedJournal.status === 'perlu_revisi') && (
                <button
                  onClick={() => handleEditJournal(selectedJournal)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-semibold hover:bg-amber-500 shadow-2xs transition-colors cursor-pointer"
                >
                  Edit Jurnal Ini
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
