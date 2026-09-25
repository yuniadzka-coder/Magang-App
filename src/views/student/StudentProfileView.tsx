import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modal';
import {
  User as UserIcon,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Calendar,
  RotateCcw,
  LogOut,
  MapPin,
  Edit2,
  Check,
  Building,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentUser, getPlaceForStudent, users, updateUser, updatePlace, resetDemoData, logout } = useApp();

  // Edit Student Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    studentClass: currentUser?.studentClass || '',
    nisn: currentUser?.nisn || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    school: currentUser?.school || '',
  });

  // Edit Place Modal State
  const [isEditPlaceOpen, setIsEditPlaceOpen] = useState(false);
  const place = currentUser ? getPlaceForStudent(currentUser) : undefined;
  const [placeForm, setPlaceForm] = useState({
    name: place?.name || '',
    sector: place?.sector || '',
    address: place?.address || '',
    companyMentorName: place?.companyMentorName || '',
    companyMentorPhone: place?.companyMentorPhone || '',
    companyMentorEmail: place?.companyMentorEmail || '',
    periodStart: place?.periodStart || '',
    periodEnd: place?.periodEnd || '',
    totalDays: place?.totalDays || 90,
  });

  if (!currentUser) return null;

  const teacherMentor = users.find((u) => u.id === currentUser.mentorId);

  const handleOpenEditProfile = () => {
    setProfileForm({
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
      name: profileForm.name,
      studentClass: profileForm.studentClass,
      nisn: profileForm.nisn,
      email: profileForm.email,
      phone: profileForm.phone,
      school: profileForm.school,
    });
    setIsEditProfileOpen(false);
  };

  const handleOpenEditPlace = () => {
    if (!place) return;
    setPlaceForm({
      name: place.name,
      sector: place.sector,
      address: place.address,
      companyMentorName: place.companyMentorName,
      companyMentorPhone: place.companyMentorPhone,
      companyMentorEmail: place.companyMentorEmail,
      periodStart: place.periodStart,
      periodEnd: place.periodEnd,
      totalDays: place.totalDays,
    });
    setIsEditPlaceOpen(true);
  };

  const handleSavePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!place) return;
    updatePlace(place.id, {
      name: placeForm.name,
      sector: placeForm.sector,
      address: placeForm.address,
      companyMentorName: placeForm.companyMentorName,
      companyMentorPhone: placeForm.companyMentorPhone,
      companyMentorEmail: placeForm.companyMentorEmail,
      periodStart: placeForm.periodStart,
      periodEnd: placeForm.periodEnd,
      totalDays: Number(placeForm.totalDays),
    });
    setIsEditPlaceOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Profil Siswa Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Informasi identitas siswa, penempatan magang, dan kontak pembimbing (dapat diedit)
          </p>
        </div>

        <button
          onClick={handleOpenEditProfile}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-950" />
          <span>Edit Biodata Siswa</span>
        </button>
      </div>

      {/* Main Student Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-bold text-2xl flex items-center justify-center shadow-md shadow-amber-200/50">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {currentUser.studentClass} · NISN: <span className="font-mono font-bold text-slate-800">{currentUser.nisn || '-'}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-300">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-800" />
                  Siswa Aktif PKL
                </span>
                <span className="text-xs text-slate-500">{currentUser.school}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenEditProfile}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Ubah</span>
          </button>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Data Pribadi Siswa
            </h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-slate-400" /> Nama Lengkap
              </span>
              <span className="font-semibold text-slate-800">{currentUser.name}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" /> Kelas & Jurusan
              </span>
              <span className="font-semibold text-slate-800">{currentUser.studentClass}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Email Akun
              </span>
              <span className="font-medium text-slate-800">{currentUser.email}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Nomor HP / WhatsApp
              </span>
              <span className="font-medium text-slate-800">{currentUser.phone || '-'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Sekolah & Guru Pembimbing
            </h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" /> Asal Sekolah
              </span>
              <span className="font-semibold text-slate-800">{currentUser.school}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-1">
              <span className="text-slate-500 text-[10px] block font-semibold">Guru Pembimbing Sekolah:</span>
              <p className="font-bold text-slate-900 text-xs">{teacherMentor?.name || '-'}</p>
              <p className="text-[11px] text-slate-600">NIP: {teacherMentor?.nip || '-'}</p>
              <p className="text-[11px] text-slate-600">Telp: {teacherMentor?.phone || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Internship Place Details Card with Edit Trigger */}
      {place && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              Informasi Tempat Praktik Kerja Lapangan (PKL)
            </h3>
            <button
              onClick={handleOpenEditPlace}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Tempat Magang</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] block">Perusahaan / Instansi:</span>
                <p className="font-bold text-slate-900 text-sm">{place.name}</p>
                <p className="text-slate-500">{place.sector}</p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-[11px] block">Alamat Kantor:</span>
                <p className="text-slate-700 leading-relaxed flex items-start gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  {place.address}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] block">Mentor Pembimbing Industri:</span>
                <p className="font-semibold text-slate-900">{place.companyMentorName}</p>
                <p className="text-slate-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {place.companyMentorPhone}
                </p>
                <p className="text-slate-600 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {place.companyMentorEmail}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-[11px] block">Durasi Magang:</span>
                <p className="font-semibold text-slate-800">
                  {place.periodStart} s.d. {place.periodEnd} ({place.totalDays} Hari)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings & Reset Action */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Aksi Akun & Reset Demo</h3>
        <p className="text-xs text-slate-500 mb-4">
          Data perubahan profil tersimpan di penyimpanan lokal browser. Anda dapat mengembalikannya kapan saja.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data demo ke kondisi awal?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-amber-50/60 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Data Demo Magang</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>

      {/* Modal Edit Profil Siswa */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Biodata Siswa"
        subtitle="Ubah nama, NISN, kelas, nomor kontak, atau asal sekolah"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NISN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={profileForm.nisn}
                onChange={(e) => setProfileForm({ ...profileForm, nisn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kelas & Jurusan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={profileForm.studentClass}
                onChange={(e) => setProfileForm({ ...profileForm, studentClass: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Akun <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Telepon / WA
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Asal Sekolah
            </label>
            <input
              type="text"
              value={profileForm.school}
              onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Tempat Magang */}
      <Modal
        isOpen={isEditPlaceOpen}
        onClose={() => setIsEditPlaceOpen(false)}
        title="Edit Informasi Tempat Magang"
        subtitle="Ubah data perusahaan, mentor industri, atau durasi magang"
        maxWidth="lg"
      >
        <form onSubmit={handleSavePlace} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Perusahaan / Instansi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={placeForm.name}
              onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Bidang / Sektor Industri
            </label>
            <input
              type="text"
              value={placeForm.sector}
              onChange={(e) => setPlaceForm({ ...placeForm, sector: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Lengkap Perusahaan
            </label>
            <textarea
              rows={2}
              value={placeForm.address}
              onChange={(e) => setPlaceForm({ ...placeForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Mentor Industri
              </label>
              <input
                type="text"
                value={placeForm.companyMentorName}
                onChange={(e) => setPlaceForm({ ...placeForm, companyMentorName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Telp Mentor Industri
              </label>
              <input
                type="text"
                value={placeForm.companyMentorPhone}
                onChange={(e) => setPlaceForm({ ...placeForm, companyMentorPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Mentor Industri
              </label>
              <input
                type="email"
                value={placeForm.companyMentorEmail}
                onChange={(e) => setPlaceForm({ ...placeForm, companyMentorEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mulai Periode</label>
              <input
                type="date"
                value={placeForm.periodStart}
                onChange={(e) => setPlaceForm({ ...placeForm, periodStart: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Selesai Periode</label>
              <input
                type="date"
                value={placeForm.periodEnd}
                onChange={(e) => setPlaceForm({ ...placeForm, periodEnd: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Hari Magang</label>
              <input
                type="number"
                value={placeForm.totalDays}
                onChange={(e) => setPlaceForm({ ...placeForm, totalDays: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                min={1}
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditPlaceOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition-colors"
            >
              Simpan Tempat Magang
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
