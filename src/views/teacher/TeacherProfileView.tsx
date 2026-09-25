import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modal';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  RotateCcw,
  LogOut,
  ShieldCheck,
  Building,
  Edit2,
  Save,
} from 'lucide-react';

export const TeacherProfileView: React.FC = () => {
  const { currentUser, updateUser, resetDemoData, logout } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    nip: currentUser?.nip || '',
    department: currentUser?.department || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    school: currentUser?.school || '',
  });

  if (!currentUser) return null;

  const handleOpenEdit = () => {
    setForm({
      name: currentUser.name,
      nip: currentUser.nip || '',
      department: currentUser.department || '',
      email: currentUser.email,
      phone: currentUser.phone || '',
      school: currentUser.school,
    });
    setIsEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      name: form.name,
      nip: form.nip,
      department: form.department,
      email: form.email,
      phone: form.phone,
      school: form.school,
    });
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Profil Guru Pembimbing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Informasi identitas pembimbing magang dan administrasi sekolah
          </p>
        </div>

        <button
          onClick={handleOpenEdit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Profil Saya</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-bold text-2xl flex items-center justify-center shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <button
                onClick={handleOpenEdit}
                className="text-xs text-amber-800 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              NIP: <span className="font-mono">{currentUser.nip || '-'}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Koordinator Pembimbing PKL
              </span>
              <span className="text-xs text-slate-500">{currentUser.school}</span>
            </div>
          </div>
        </div>

        {/* Data details */}
        <div className="pt-6 space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Email Akun
            </span>
            <span className="font-medium text-slate-800">{currentUser.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" /> Unit / Departemen
            </span>
            <span className="font-medium text-slate-800">{currentUser.department || 'Guru Pembimbing'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> Telepon / Kontak
            </span>
            <span className="font-medium text-slate-800">{currentUser.phone || '-'}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-400" /> Asal Satuan Pendidikan
            </span>
            <span className="font-medium text-slate-800">{currentUser.school}</span>
          </div>
        </div>
      </div>

      {/* Demo Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Aksi Pengaturan Akun</h3>
        <p className="text-xs text-slate-500 mb-4">
          Kelola data lokal untuk keperluan demonstrasi atau keluar dari sistem
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset semua data kembali ke kondisi demo awal?')) {
                resetDemoData();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Data Demo</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>

      {/* Modal Edit Guru */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profil Guru Pembimbing"
        subtitle="Perbarui data nama lengkap, NIP, kontak, dan departemen Anda"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap Guru <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                value={form.nip}
                onChange={(e) => setForm({ ...form, nip: e.target.value })}
                className="w-full px-3.5 py-2.5 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Departemen / Jabatan
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Akun <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Satuan Pendidikan / Asal Sekolah
            </label>
            <input
              type="text"
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
