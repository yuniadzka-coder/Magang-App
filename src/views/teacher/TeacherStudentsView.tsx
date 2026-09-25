import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { User } from '../../types';
import {
  Search,
  Filter,
  Eye,
  Building2,
  GraduationCap,
  ChevronRight,
  User as UserIcon,
  Plus,
  Edit2,
  Save,
  Check,
  Mail,
  Phone,
} from 'lucide-react';

interface TeacherStudentsViewProps {
  onSelectStudent: (studentId: string) => void;
}

export const TeacherStudentsView: React.FC<TeacherStudentsViewProps> = ({ onSelectStudent }) => {
  const { users, places, journals, attendance, targets, updateUser, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [placeFilter, setPlaceFilter] = useState('all');

  // Edit / Add Student Modal State
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    studentClass: '',
    nisn: '',
    phone: '',
    school: 'SMA Negeri 1 Maju Bersama',
    internshipPlaceId: '',
  });

  const students = users.filter((u) => u.role === 'siswa');

  // Collect classes
  const classes = Array.from(new Set(students.map((s) => s.studentClass).filter(Boolean)));

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.nisn && s.nisn.includes(searchTerm)) ||
      (s.studentClass && s.studentClass.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass = classFilter === 'all' || s.studentClass === classFilter;
    const matchesPlace = placeFilter === 'all' || s.internshipPlaceId === placeFilter;

    return matchesSearch && matchesClass && matchesPlace;
  });

  const handleOpenEdit = (student: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFormState({
      name: student.name,
      email: student.email,
      studentClass: student.studentClass || '',
      nisn: student.nisn || '',
      phone: student.phone || '',
      school: student.school,
      internshipPlaceId: student.internshipPlaceId || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateUser(editingStudent.id, {
      name: formState.name,
      email: formState.email,
      studentClass: formState.studentClass,
      nisn: formState.nisn,
      phone: formState.phone,
      school: formState.school,
      internshipPlaceId: formState.internshipPlaceId || undefined,
    });
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Daftar Siswa Bimbingan Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola dan pantau seluruh siswa peserta PKL, edit data (Nama, NISN, Kelas), dan tinjau progres
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Total: <strong className="text-slate-800 font-mono">{filteredStudents.length}</strong> siswa
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NISN, kelas, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={placeFilter}
            onChange={(e) => setPlaceFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Tempat Magang</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const place = places.find((p) => p.id === student.internshipPlaceId);
          const sJournals = journals.filter((j) => j.studentId === student.id);
          const pendingCount = sJournals.filter((j) => j.status === 'menunggu_review').length;
          const sAttendance = attendance.filter((a) => a.studentId === student.id);
          const sHadir = sAttendance.filter((a) => a.status === 'hadir').length;
          const sPercent =
            sAttendance.length > 0 ? Math.round((sHadir / sAttendance.length) * 100) : 100;
          const sTargets = targets.filter(
            (t) => t.studentId === student.id || t.studentId === 'all'
          );
          const completedTargets = sTargets.filter((t) => t.status === 'selesai').length;

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                        {student.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {student.studentClass} · NISN: <span className="font-mono font-medium text-slate-700">{student.nisn || '-'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {pendingCount > 0 && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        {pendingCount} review
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(student, e)}
                      title="Edit Data Siswa (Nama, NISN, Kelas)"
                      className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {place && (
                  <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-100 text-xs mb-3 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 truncate">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{place.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate pl-5">
                      Mentor: {place.companyMentorName}
                    </p>
                  </div>
                )}

                {/* Micro Stats */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Presensi</span>
                    <span className="font-mono font-bold text-xs text-emerald-700">
                      {sPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Jurnal</span>
                    <span className="font-mono font-bold text-xs text-slate-800">
                      {sJournals.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target</span>
                    <span className="font-mono font-bold text-xs text-amber-800">
                      {completedTargets}/{sTargets.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs text-amber-700 font-semibold group-hover:text-amber-800">
                <span>Buka Detail & Evaluasi</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Edit Siswa untuk Guru */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Data Siswa Bimbingan"
        subtitle={`Perbarui data identitas dan penempatan magang ${editingStudent?.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: Raditya Pratama"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NISN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formState.nisn}
                onChange={(e) => setFormState({ ...formState, nisn: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: 0061234567"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kelas / Rombel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formState.studentClass}
                onChange={(e) => setFormState({ ...formState, studentClass: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Contoh: XII RPL 1"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempat Magang / Perusahaan
              </label>
              <select
                value={formState.internshipPlaceId}
                onChange={(e) => setFormState({ ...formState, internshipPlaceId: e.target.value })}
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
                No. Telepon / WhatsApp Siswa
              </label>
              <input
                type="tel"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="0812-xxxx-xxxx"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Akun Siswa
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="siswa@demo.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Asal Sekolah
              </label>
              <input
                type="text"
                value={formState.school}
                onChange={(e) => setFormState({ ...formState, school: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="SMA Negeri 1 Maju Bersama"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan Siswa</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
