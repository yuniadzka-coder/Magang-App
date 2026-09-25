import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { JournalEntry, AttendanceStatus, Target } from '../../types';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Target as TargetIcon,
  Image as ImageIcon,
  Check,
  Edit2,
  Mail,
  Phone,
  Plus,
  Send,
  User,
  GraduationCap,
  MapPin,
  Save,
} from 'lucide-react';

interface TeacherStudentDetailViewProps {
  studentId: string;
  onBack: () => void;
}

export const TeacherStudentDetailView: React.FC<TeacherStudentDetailViewProps> = ({
  studentId,
  onBack,
}) => {
  const {
    users,
    places,
    journals,
    attendance,
    targets,
    documentations,
    reviewJournal,
    recordStudentAttendanceManual,
    addTarget,
    updateUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'jurnal' | 'kehadiran' | 'target' | 'dokumentasi'>('jurnal');

  // Review journal modal
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [reviewAction, setReviewAction] = useState<'disetujui' | 'perlu_revisi'>('disetujui');
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Manual attendance modal
  const [attModalOpen, setAttModalOpen] = useState(false);
  const [attDate, setAttDate] = useState(new Date().toISOString().slice(0, 10));
  const [attStatus, setAttStatus] = useState<AttendanceStatus>('hadir');
  const [attNote, setAttNote] = useState('');

  // Add target modal
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [targetTitle, setTargetTitle] = useState('');
  const [targetDesc, setTargetDesc] = useState('');
  const [targetDeadline, setTargetDeadline] = useState('2026-10-15');

  // Edit Student Info Modal State
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    studentClass: '',
    nisn: '',
    phone: '',
    school: '',
    internshipPlaceId: '',
  });

  const student = users.find((u) => u.id === studentId);
  if (!student) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-600">Siswa tidak ditemukan.</p>
        <button
          onClick={onBack}
          className="mt-3 px-4 py-2 bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl"
        >
          Kembali
        </button>
      </div>
    );
  }

  const place = places.find((p) => p.id === student.internshipPlaceId);
  const studentJournals = journals.filter((j) => j.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentTargets = targets.filter(
    (t) => t.studentId === student.id || t.studentId === 'all'
  );
  const studentDocs = documentations.filter((d) => d.studentId === student.id);

  // Stats
  const totalHadir = studentAttendance.filter((a) => a.status === 'hadir').length;
  const totalIzin = studentAttendance.filter((a) => a.status === 'izin').length;
  const totalSakit = studentAttendance.filter((a) => a.status === 'sakit').length;
  const totalAlpa = studentAttendance.filter((a) => a.status === 'alpa').length;
  const percentAttendance =
    studentAttendance.length > 0
      ? Math.round((totalHadir / studentAttendance.length) * 100)
      : 100;

  const totalDays = place ? place.totalDays : 90;
  const daysCompleted = Math.min(studentAttendance.length + 15, totalDays);
  const progressPercent = Math.min(Math.round((daysCompleted / totalDays) * 100), 100);

  const handleOpenEditStudent = () => {
    setStudentForm({
      name: student.name,
      email: student.email,
      studentClass: student.studentClass || '',
      nisn: student.nisn || '',
      phone: student.phone || '',
      school: student.school,
      internshipPlaceId: student.internshipPlaceId || '',
    });
    setEditStudentOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(student.id, {
      name: studentForm.name,
      email: studentForm.email,
      studentClass: studentForm.studentClass,
      nisn: studentForm.nisn,
      phone: studentForm.phone,
      school: studentForm.school,
      internshipPlaceId: studentForm.internshipPlaceId || undefined,
    });
    setEditStudentOpen(false);
  };

  const openReviewModal = (journal: JournalEntry, action: 'disetujui' | 'perlu_revisi') => {
    setSelectedJournal(journal);
    setReviewAction(action);
    setFeedbackText(
      action === 'disetujui'
        ? 'Jurnal telah diperiksa dan disetujui. Deskripsi dan bukti kegiatan sangat baik.'
        : 'Mohon perbaiki deskripsi kendala teknis dan lampirkan foto dokumentasi yang relevan.'
    );
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJournal) return;
    reviewJournal(selectedJournal.id, reviewAction, feedbackText);
    setReviewModalOpen(false);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    recordStudentAttendanceManual(student.id, attDate, attStatus, attNote);
    setAttModalOpen(false);
    setAttNote('');
  };

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTitle.trim()) return;
    addTarget({
      studentId: student.id,
      studentName: student.name,
      title: targetTitle,
      description: targetDesc,
      deadline: targetDeadline,
      status: 'belum_dimulai',
      progress: 0,
    });
    setTargetTitle('');
    setTargetDesc('');
    setTargetModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          title="Kembali ke daftar siswa"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Detail Siswa Bimbingan
          </h1>
          <p className="text-xs text-slate-500">
            Monitoring rekapitulasi individu, edit data siswa, dan evaluasi jurnal magang
          </p>
        </div>
      </div>

      {/* Student Overview Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                <button
                  onClick={handleOpenEditStudent}
                  title="Edit Nama, NISN, Kelas Siswa"
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Data</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.studentClass} · NISN: <span className="font-mono font-medium text-slate-800">{student.nisn || '-'}</span> · {student.school}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.email}</span>
                <span className="text-slate-300">·</span>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.phone || '-'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setAttModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Input Presensi Manual</span>
            </button>
            <button
              onClick={() => setTargetModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Beri Target Khusus</span>
            </button>
          </div>
        </div>

        {/* Place & Mentor info */}
        {place && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Tempat Magang:</span>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">{place.name}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">{place.sector}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Mentor Industri:</span>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">
                {place.companyMentorName}
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                {place.companyMentorPhone} · {place.companyMentorEmail}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Periode Magang:</span>
              <p className="font-semibold text-slate-800 text-sm mt-0.5">
                {place.periodStart} s.d. {place.periodEnd}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] font-bold text-amber-700">
                  {progressPercent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Fast Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500">Presensi Kehadiran</span>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {percentAttendance}%
          </p>
          <span className="text-[10px] text-slate-400">
            {totalHadir} Hadir / {totalIzin} Izin / {totalSakit} Sakit
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500">Total Jurnal</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">
            {studentJournals.length}
          </p>
          <span className="text-[10px] text-emerald-600">
            {studentJournals.filter((j) => j.status === 'disetujui').length} Disetujui
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500">Menunggu Review</span>
          <p className="text-xl font-bold font-mono text-amber-700 mt-1">
            {studentJournals.filter((j) => j.status === 'menunggu_review').length}
          </p>
          <span className="text-[10px] text-amber-700 font-semibold">Butuh feedback guru</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500">Target Magang</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">
            {studentTargets.filter((t) => t.status === 'selesai').length} / {studentTargets.length}
          </p>
          <span className="text-[10px] text-amber-700 font-semibold">Selesai dievaluasi</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-1.5 p-1 bg-amber-50/70 border border-amber-200/80 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('jurnal')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'jurnal' ? 'bg-amber-400 text-slate-950 shadow-xs font-bold' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          Riwayat Jurnal ({studentJournals.length})
        </button>
        <button
          onClick={() => setActiveTab('kehadiran')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'kehadiran' ? 'bg-amber-400 text-slate-950 shadow-xs font-bold' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          Presensi ({studentAttendance.length})
        </button>
        <button
          onClick={() => setActiveTab('target')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'target' ? 'bg-amber-400 text-slate-950 shadow-xs font-bold' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          Target ({studentTargets.length})
        </button>
        <button
          onClick={() => setActiveTab('dokumentasi')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'dokumentasi' ? 'bg-amber-400 text-slate-950 shadow-xs font-bold' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          Galeri ({studentDocs.length})
        </button>
      </div>

      {/* TAB CONTENT 1: JURNAL */}
      {activeTab === 'jurnal' && (
        <div className="space-y-3">
          {studentJournals.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Siswa belum memiliki catatan jurnal kegiatan.</p>
            </div>
          ) : (
            studentJournals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {journal.date}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      {journal.checkInTime} - {journal.checkOutTime}
                    </span>
                  </div>
                  <StatusBadge type="journal" status={journal.status} />
                </div>

                <h3 className="text-sm font-bold text-slate-900">{journal.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Deskripsi Kegiatan
                    </span>
                    <p className="text-slate-600 leading-relaxed">{journal.description}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Hal yang Dipelajari
                    </span>
                    <p className="text-slate-600 leading-relaxed">{journal.learned || '-'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Kendala Lapangan
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {journal.challenges || 'Tidak ada kendala'}
                    </p>
                  </div>
                </div>

                {journal.photoUrl && (
                  <div className="mt-2">
                    <img
                      src={journal.photoUrl}
                      alt={journal.title}
                      className="w-48 h-32 object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}

                {/* Feedback Section */}
                {journal.feedbackTeacher && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
                    <span className="font-semibold text-amber-900 block mb-0.5">
                      Catatan Evaluasi Guru ({journal.feedbackDate}):
                    </span>
                    <p className="text-amber-950">{journal.feedbackTeacher}</p>
                  </div>
                )}

                {/* Review Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => openReviewModal(journal, 'perlu_revisi')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Minta Revisi
                  </button>
                  <button
                    onClick={() => openReviewModal(journal, 'disetujui')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui Jurnal</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 2: KEHADIRAN */}
      {activeTab === 'kehadiran' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rekap Presensi Harian Siswa</h3>
              <p className="text-xs text-slate-500">Daftar kehadiran selama magang di tempat PKL</p>
            </div>
            <button
              onClick={() => setAttModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-2xs transition-colors cursor-pointer"
            >
              + Input Presensi
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Jam Masuk</th>
                  <th className="py-3 px-4">Jam Pulang</th>
                  <th className="py-3 px-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Belum ada data presensi siswa.
                    </td>
                  </tr>
                ) : (
                  studentAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {record.date}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge type="attendance" status={record.status} />
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {record.checkInTime || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {record.checkOutTime || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{record.note || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: TARGET */}
      {activeTab === 'target' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Target & Penugasan Khusus Siswa</h3>
              <p className="text-xs text-slate-500">Kelola target kompetensi yang harus dicapai siswa ini</p>
            </div>
            <button
              onClick={() => setTargetModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-2xs transition-colors cursor-pointer"
            >
              + Beri Target Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentTargets.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200">
                <TargetIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada target khusus untuk siswa ini.</p>
              </div>
            ) : (
              studentTargets.map((target) => (
                <div
                  key={target.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{target.title}</h4>
                    <StatusBadge type="target" status={target.status} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{target.description}</p>
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Progres Siswa</span>
                      <span className="font-mono font-bold text-amber-700">{target.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${target.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Deadline: {target.deadline}</span>
                    <span className="capitalize">{target.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: DOKUMENTASI */}
      {activeTab === 'dokumentasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Galeri Dokumentasi Kegiatan</h3>
              <p className="text-xs text-slate-500">Foto-foto aktivitas PKL yang diunggah oleh siswa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentDocs.length === 0 ? (
              <div className="col-span-3 p-8 text-center bg-white rounded-2xl border border-slate-200">
                <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada foto dokumentasi yang diunggah siswa.</p>
              </div>
            ) : (
              studentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs group"
                >
                  <img
                    src={doc.photoUrl}
                    alt={doc.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block">{doc.date}</span>
                    <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{doc.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal Edit Data Siswa untuk Guru */}
      <Modal
        isOpen={editStudentOpen}
        onClose={() => setEditStudentOpen(false)}
        title={`Edit Data Siswa: ${student.name}`}
        subtitle="Ubah informasi nama, NISN, kelas, atau kontak siswa"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NISN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentForm.nisn}
                onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kelas / Jurusan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentForm.studentClass}
                onChange={(e) => setStudentForm({ ...studentForm, studentClass: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempat Magang
              </label>
              <select
                value={studentForm.internshipPlaceId}
                onChange={(e) => setStudentForm({ ...studentForm, internshipPlaceId: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Belum Ditentukan --</option>
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sector})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={studentForm.phone}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asal Sekolah
              </label>
              <input
                type="text"
                value={studentForm.school}
                onChange={(e) => setStudentForm({ ...studentForm, school: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditStudentOpen(false)}
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

      {/* Modal Review Jurnal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Evaluasi & Beri Feedback Jurnal"
        subtitle={`Jurnal: ${selectedJournal?.title} (${selectedJournal?.date})`}
        maxWidth="md"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Keputusan Review</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReviewAction('disetujui')}
                className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  reviewAction === 'disetujui'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Check className="w-4 h-4 text-amber-700" />
                <span>Setujui Jurnal</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewAction('perlu_revisi')}
                className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  reviewAction === 'perlu_revisi'
                    ? 'bg-amber-200 border-amber-500 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <span>Perlu Revisi</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan / Arahan untuk Siswa
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Tuliskan komentar konstruktif atau instruksi perbaikan..."
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 shadow-xs cursor-pointer"
            >
              Kirim Feedback
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Presensi Manual */}
      <Modal
        isOpen={attModalOpen}
        onClose={() => setAttModalOpen(false)}
        title={`Input Presensi Manual: ${student.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={attDate}
              onChange={(e) => setAttDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status Kehadiran</label>
            <select
              value={attStatus}
              onChange={(e) => setAttStatus(e.target.value as AttendanceStatus)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpa">Alpa</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan / Alasan</label>
            <input
              type="text"
              placeholder="Contoh: Izin dispensasi dinas luar"
              value={attNote}
              onChange={(e) => setAttNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setAttModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 shadow-xs cursor-pointer"
            >
              Simpan Presensi
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Target Khusus */}
      <Modal
        isOpen={targetModalOpen}
        onClose={() => setTargetModalOpen(false)}
        title={`Beri Target untuk ${student.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateTarget} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Judul Target / Tugas</label>
            <input
              type="text"
              placeholder="Contoh: Selesaikan Modul Integrasi Database"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deskripsi Tugas</label>
            <textarea
              rows={3}
              placeholder="Rincian kompetensi atau output yang diharapkan..."
              value={targetDesc}
              onChange={(e) => setTargetDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Batas Waktu (Deadline)</label>
            <input
              type="date"
              value={targetDeadline}
              onChange={(e) => setTargetDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setTargetModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 shadow-xs cursor-pointer"
            >
              Tugaskan Target
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
