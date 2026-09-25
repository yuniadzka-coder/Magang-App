import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { JournalEntry, Announcement } from '../../types';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Target as TargetIcon,
  ChevronRight,
  PlusCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  Megaphone,
  Edit2,
  Check,
  Save,
} from 'lucide-react';

interface StudentDashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigate }) => {
  const {
    currentUser,
    getPlaceForStudent,
    getStudentStats,
    journals,
    announcements,
    attendance,
    updateUser,
  } = useApp();

  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Quick edit profile modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    studentClass: currentUser?.studentClass || '',
    nisn: currentUser?.nisn || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    school: currentUser?.school || '',
  });

  if (!currentUser) return null;

  const place = getPlaceForStudent(currentUser);
  const stats = getStudentStats(currentUser.id);

  // Student's recent journals (up to 3)
  const recentJournals = journals
    .filter((j) => j.studentId === currentUser.id)
    .slice(0, 3);

  // Today's attendance status
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendance.find(
    (a) => a.studentId === currentUser.id && a.date === today
  );

  // Calculate percentage of internship period completed
  const progressPercent = Math.min(
    Math.round((stats.daysCompleted / stats.totalDays) * 100),
    100
  );

  const handleOpenEdit = () => {
    setEditForm({
      name: currentUser.name,
      studentClass: currentUser.studentClass || '',
      nisn: currentUser.nisn || '',
      email: currentUser.email,
      phone: currentUser.phone || '',
      school: currentUser.school,
    });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name: editForm.name,
      studentClass: editForm.studentClass,
      nisn: editForm.nisn,
      email: editForm.email,
      phone: editForm.phone,
      school: editForm.school,
    });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Hero Card: Student Info & Internship Place */}
      <div className="bg-white rounded-2xl p-6 border border-amber-200/70 shadow-xs relative overflow-hidden">
        {/* Subtle yellow ambient accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Program Magang Siswa SMA / SMK</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Halo, {currentUser.name}! 👋
              </h1>
              <button
                onClick={handleOpenEdit}
                title="Edit Nama, Kelas, NISN"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-100/80 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Data</span>
              </button>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-medium text-slate-800">{currentUser.studentClass || 'Kelas Belum Diisi'}</span> · NISN: <span className="font-mono font-medium text-slate-800">{currentUser.nisn || '-'}</span> · {currentUser.school}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('jurnal')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Tulis Jurnal Hari Ini</span>
            </button>
            <button
              onClick={() => onNavigate('kehadiran')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Presensi Kehadiran</span>
            </button>
          </div>
        </div>

        {/* Place Information Subcard */}
        {place && (
          <div className="relative z-10 mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px]">Tempat Magang:</span>
                <span className="font-semibold text-slate-800">{place.name}</span>
                <p className="text-slate-500 mt-0.5">{place.sector}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px]">Periode Magang:</span>
                <span className="font-semibold text-slate-800">
                  {place.periodStart} s.d. {place.periodEnd}
                </span>
                <p className="text-slate-500 mt-0.5">Total Durasi: {place.totalDays} Hari</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px]">Pembimbing Industri:</span>
                <span className="font-semibold text-slate-800">{place.companyMentorName}</span>
                <p className="text-slate-500 mt-0.5">{place.companyMentorPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar Magang */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">Progres Periode Magang</span>
            <span className="font-mono font-bold text-amber-700">
              {stats.daysCompleted} / {stats.totalDays} Hari ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hari Magang */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Hari Magang</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {stats.daysCompleted}
            <span className="text-xs font-normal text-slate-400 font-sans ml-1">/ {stats.totalDays} hari</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500">
            {stats.totalDays - stats.daysCompleted} hari tersisa
          </div>
        </div>

        {/* Kehadiran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Persentase Kehadiran</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {stats.attendancePercent}%
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">{stats.totalHadir} Hadir</span>
            <span>·</span>
            <span>{stats.totalIzin} Izin</span>
            <span>·</span>
            <span>{stats.totalSakit} Sakit</span>
          </div>
        </div>

        {/* Jurnal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Jurnal Tercatat</span>
            <BookOpen className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {stats.totalJournals}
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">{stats.approvedJournals} Disetujui</span>
            <span>·</span>
            <span className="text-amber-600 font-semibold">{stats.pendingJournals} Menunggu</span>
          </div>
        </div>

        {/* Target Selesai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Target Selesai</span>
            <TargetIcon className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {stats.completedTargets}
            <span className="text-xs font-normal text-slate-400 font-sans ml-1">/ {stats.totalTargets} tugas</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500">
            {stats.inProgressTargets} sedang dikerjakan
          </div>
        </div>
      </div>

      {/* 3. Section: Status Presensi Hari Ini */}
      <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 border border-amber-300 flex items-center justify-center text-slate-950 shadow-2xs">
            <Clock className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Presensi Hari Ini ({today})
            </h4>
            <p className="text-xs text-slate-600">
              {todayAttendance ? (
                <>
                  Status:{' '}
                  <span className="font-semibold capitalize text-emerald-700">
                    {todayAttendance.status}
                  </span>
                  {todayAttendance.checkInTime && ` (Masuk: ${todayAttendance.checkInTime})`}
                  {todayAttendance.checkOutTime && ` (Pulang: ${todayAttendance.checkOutTime})`}
                </>
              ) : (
                'Anda belum melakukan presensi untuk hari ini.'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('kehadiran')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-100 text-slate-800 text-xs font-semibold rounded-xl border border-amber-200 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <span>{todayAttendance ? 'Lihat / Ubah Presensi' : 'Isi Presensi Sekarang'}</span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* 4. Grid Two Columns: Jurnal Terbaru & Pengumuman */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section: Jurnal Terbaru */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Jurnal Terbaru</h3>
              <p className="text-xs text-slate-500">Catatan kegiatan harian terakhir</p>
            </div>
            <button
              onClick={() => onNavigate('jurnal')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {recentJournals.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-500">Belum ada jurnal yang dibuat.</p>
                <button
                  onClick={() => onNavigate('jurnal')}
                  className="mt-2 text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                >
                  Mulai tulis jurnal pertama
                </button>
              </div>
            ) : (
              recentJournals.map((journal) => (
                <div
                  key={journal.id}
                  onClick={() => setSelectedJournal(journal)}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono text-slate-500">{journal.date}</span>
                    <StatusBadge type="journal" status={journal.status} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {journal.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {journal.description}
                  </p>

                  {journal.feedbackTeacher && (
                    <div className="mt-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-1.5">
                      <span className="font-semibold shrink-0 text-amber-800">Catatan Guru:</span>
                      <span className="line-clamp-1 italic">{journal.feedbackTeacher}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section: Pengumuman Guru */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pengumuman Pembimbing</h3>
              <p className="text-xs text-slate-500">Instruksi & informasi resmi sekolah</p>
            </div>
            <button
              onClick={() => onNavigate('pengumuman')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {announcements.slice(0, 3).map((anc) => (
              <div
                key={anc.id}
                onClick={() => setSelectedAnnouncement(anc)}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono text-slate-500">{anc.date}</span>
                  <StatusBadge type="priority" status={anc.priority} />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                  {anc.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {anc.content}
                </p>
                <div className="mt-2 text-[11px] text-slate-400">
                  Oleh: <span className="font-medium text-slate-600">{anc.teacherName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Edit Data Siswa Langsung */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Data Siswa Magang"
        subtitle="Ubah informasi nama lengkap, NISN, kelas, dan kontak Anda"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: Raditya Pratama"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NISN (Nomor Induk Siswa Nasional) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.nisn}
                onChange={(e) => setEditForm({ ...editForm, nisn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: 0061234567"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kelas / Jurusan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editForm.studentClass}
                onChange={(e) => setEditForm({ ...editForm, studentClass: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: XII RPL 1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asal Sekolah
              </label>
              <input
                type="text"
                value={editForm.school}
                onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: SMA Negeri 1 Maju Bersama"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: 0812-3456-7890"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="siswa@demo.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </Modal>

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
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {selectedJournal.description}
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-800 mb-1">Hal yang Dipelajari:</h5>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {selectedJournal.learned || '-'}
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-800 mb-1">Kendala yang Dihadapi:</h5>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {selectedJournal.challenges || 'Tidak ada kendala berarti.'}
              </p>
            </div>

            {selectedJournal.photoUrl && (
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Foto Dokumentasi:</h5>
                <img
                  src={selectedJournal.photoUrl}
                  alt={selectedJournal.title}
                  className="w-full h-56 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
              </div>
            )}

            {selectedJournal.feedbackTeacher && (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-900 text-xs">Feedback Guru Pembimbing:</span>
                  <span className="text-[10px] text-amber-700">{selectedJournal.feedbackDate}</span>
                </div>
                <p className="text-amber-950 leading-relaxed">{selectedJournal.feedbackTeacher}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

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

            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line p-3 bg-slate-50 rounded-xl border border-slate-100">
              {selectedAnnouncement.content}
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Peran: <span className="font-medium text-slate-700">{selectedAnnouncement.teacherRole}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

